# Meu Pix — protótipo seguro

Este é um protótipo de interface para iPhone e navegador. **Não movimenta dinheiro real.** Os valores, cobranças, QR visual e transferências são inteiramente fictícios.

## Como testar no computador
1. Extraia o ZIP.
2. Abra `index.html` no navegador.
3. Use **Receber Pix** e gere uma cobrança de demonstração.
4. Toque em **Simular pagamento recebido** para adicionar saldo fictício.
5. Teste a transferência simulada usando esse saldo.

## Como testar no iPhone
Para instalar como web app, os arquivos precisam estar publicados em um endereço HTTPS:
1. Hospede os arquivos estáticos em um serviço HTTPS.
2. Abra o endereço no Safari do iPhone.
3. Toque em Compartilhar → **Adicionar à Tela de Início**.

## Para uma integração real (etapa futura)
- Criar um backend HTTPS (por exemplo, Node.js) para chamar a API do provedor.
- Guardar tokens de API apenas em variáveis de ambiente no servidor, nunca no JavaScript do navegador.
- Validar pagamentos com webhooks assinados/validados e consultar o status no servidor.
- Implementar autenticação forte, limites, idempotência, registros de auditoria e confirmação do destinatário antes de transferências.
- Confirmar elegibilidade da conta e tarifas com o provedor.
- Nunca confiar no saldo calculado no cliente como saldo financeiro real.

## Arquivos
- `index.html`: interface principal
- `styles.css`: estilo responsivo
- `app.js`: interações simuladas
- `manifest.json` e `sw.js`: suporte de instalação/offline
