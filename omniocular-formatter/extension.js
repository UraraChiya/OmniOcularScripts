const vscode = require('vscode');
const prettier = require('prettier');
const babelPlugin = require(require.resolve('prettier/plugins/babel'));
const estreePlugin = require(require.resolve('prettier/plugins/estree'));

function activate(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('omniocular-js');

    async function updateDiagnostics(document) {
        // 修改点：只监听 omniocular 语言
        if (!document || document.languageId !== 'omniocular') return;

        const text = document.getText();
        const diagnostics = [];
        const jsBlockRegex = /<(line|init)[^>]*>([\s\S]*?)<\/\1>/g;
        let match;

        while ((match = jsBlockRegex.exec(text)) !== null) {
            const fullTagMatch = match[0];
            const jsCodeInside = match[2];
            if (!jsCodeInside.trim()) continue;

            const openTagMatch = fullTagMatch.match(/<(line|init)[^>]*>/);
            if (!openTagMatch) continue;
            
            const openTag = openTagMatch[0];
            const beforeJsContent = text.substring(0, match.index + openTag.length);
            const lines = beforeJsContent.split('\n');
            const lineOffset = lines.length - 1;
            const charOffsetInFirstLine = lines[lines.length - 1].length;

            try {
                await prettier.check(jsCodeInside, {
                    parser: "babel",
                    plugins: [babelPlugin, estreePlugin]
                });
            } catch (err) {
                if (err.loc) {
                    const { line, column } = err.loc.start;
                    
                    // 坐标映射逻辑
                    let finalLine = lineOffset + (line - 1);
                    let finalCharacter = (line === 1) ? (charOffsetInFirstLine + column) : column;

                    const errorPosition = new vscode.Position(finalLine, finalCharacter);
                    const range = new vscode.Range(errorPosition, errorPosition.translate(0, 1));

                    const diagnostic = new vscode.Diagnostic(
                        range,
                        `[OmniOcular JS] ${err.message.split('\n')[0]}`,
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostics.push(diagnostic);
                }
            }
        }
        diagnosticCollection.set(document.uri, diagnostics);
    }

    // 注册格式化程序，针对 omniocular
    const formatProvider = vscode.languages.registerDocumentFormattingEditProvider('omniocular', {
        async provideDocumentFormattingEdits(document) {
            const text = document.getText();
            let newText = text;
            const formatRegex = /([ \t]*)(<(line|init)[^>]*>)([\s\S]*?)(<\/\3>)/g;

            const matches = [];
            let match;
            while ((match = formatRegex.exec(text)) !== null) {
                matches.push({
                    index: match.index,
                    fullMatch: match[0],
                    indent: match[1],
                    openTag: match[2],
                    jsCode: match[4],
                    closeTag: match[5]
                });
            }

            for (let i = matches.length - 1; i >= 0; i--) {
                const m = matches[i];
                try {
                    const formattedJS = await prettier.format(m.jsCode.trim(), {
                        parser: "babel",
                        plugins: [babelPlugin, estreePlugin],
                        semi: true,
                        singleQuote: true,
                        printWidth: 100,
                        tabWidth: 4,
                        trailingComma: "none"
                    });

                    const baseIndent = m.indent;
                    const jsIndent = baseIndent + "    ";
                    const processedJS = formattedJS.trim().split('\n')
                        .map(line => line.trim() ? jsIndent + line : "")
                        .join('\n');

                    const replacement = `${baseIndent}${m.openTag}\n${processedJS}\n${baseIndent}${m.closeTag}`;
                    newText = newText.slice(0, m.index) + replacement + newText.slice(m.index + m.fullMatch.length);
                } catch (e) {
                    continue; 
                }
            }
            if (newText === text) return [];
            return [vscode.TextEdit.replace(new vscode.Range(document.positionAt(0), document.positionAt(text.length)), newText)];
        }
    });

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document)),
        vscode.window.onDidChangeActiveTextEditor(editor => editor && updateDiagnostics(editor.document)),
        formatProvider,
        diagnosticCollection
    );

    if (vscode.window.activeTextEditor) updateDiagnostics(vscode.window.activeTextEditor.document);
}

exports.activate = activate;