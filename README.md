
# 🧩 AutiAmigo - Como Publicar o Site

Este projeto está pronto para ser publicado gratuitamente. Siga os passos abaixo:

## Opção 1: Vercel (Recomendado)
1. Crie uma conta em [vercel.com](https://vercel.com).
2. Instale a Vercel CLI ou conecte seu repositório do GitHub.
3. No painel da Vercel, adicione um novo projeto.
4. **IMPORTANTE:** Nas configurações do projeto, vá em "Environment Variables" e adicione:
   - Key: `API_KEY`
   - Value: `SUA_CHAVE_DA_GEMINI_API` (Obtenha em [aistudio.google.com](https://aistudio.google.com/app/apikey))
5. Clique em **Deploy**.

## Opção 2: Netlify
1. Crie uma conta em [netlify.com](https://netlify.com).
2. Arraste a pasta do projeto para o campo de upload ou conecte ao GitHub.
3. Vá em "Site configuration" > "Environment variables" e adicione a sua `API_KEY`.

## Notas de Desenvolvimento
- O app usa `localStorage` para salvar cartões e rotinas localmente no navegador.
- A Gemini AI é usada para gerar as Histórias Sociais.
