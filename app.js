const $ = (s) => document.querySelector(s);
const modal = $("#modal");
const content = $("#modalContent");
const title = $("#modalTitle");
let balanceVisible = true;
let balance = 0;
let transactions = [];
const money = n => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);
const dateLabel = () => new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(new Date());

function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600)}
function renderBalance(){$("#balance").textContent=balanceVisible?money(balance):"••••••";$("#toggleBalance").textContent=balanceVisible?"◉":"◎"}
function renderTransactions(){
 const root=$("#transactions");
 if(!transactions.length){root.innerHTML='<div class="empty-state"><div class="empty-icon">↔</div><strong>Nenhuma movimentação</strong><p>Suas transações de demonstração aparecerão aqui.</p></div>';return}
 root.innerHTML=transactions.map(t=>`<div class="transaction"><div class="tx-icon">${t.type==="in"?"↓":"↗"}</div><div class="tx-info"><strong>${escapeHtml(t.label)}</strong><small>${escapeHtml(t.date)} · Demonstração</small></div><div class="tx-amount ${t.type}">${t.type==="in"?"+":"−"} ${money(t.amount)}</div></div>`).join("");
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function openModal(view){
 title.textContent = view==="receive"?"Receber Pix":view==="transfer"?"Transferir":view==="security"?"Segurança e privacidade":"Meu Pix";
 if(view==="receive"){
  content.innerHTML=`<p class="helper">Gere uma cobrança fictícia para conhecer o fluxo. Nenhum QR Code válido será criado e nenhum pagamento real será recebido.</p>
  <form id="receiveForm"><div class="form-field"><label for="receiveAmount">Valor (R$)</label><input id="receiveAmount" inputmode="decimal" placeholder="25,00" required></div><div class="form-field"><label for="receiveNote">Descrição (opcional)</label><input id="receiveNote" maxlength="70" placeholder="Ex.: pagamento de teste"></div><button class="primary-button" type="submit">Gerar Pix de demonstração</button></form>`;
  $("#receiveForm").addEventListener("submit",e=>{e.preventDefault();const amount=parseAmount($("#receiveAmount").value);if(!amount){toast("Informe um valor válido maior que zero.");return}const note=$("#receiveNote").value.trim()||"Cobrança de teste";content.innerHTML=`<div class="demo-box"><div class="fake-qr">DEMO<br>PIX</div><strong>Pix de demonstração criado</strong><div class="demo-amount">${money(amount)}</div><p class="helper">Este é apenas um exemplo visual. Não é um QR Code Pix válido e não pode receber dinheiro.</p></div><button class="primary-button" id="simulateReceive">Simular pagamento recebido</button><button class="secondary-button" id="backReceive">Voltar</button>`;$("#simulateReceive").onclick=()=>{balance+=amount;transactions.unshift({type:"in",amount,label:note,date:dateLabel()});renderBalance();renderTransactions();modal.close();toast("Pagamento fictício adicionado ao saldo de demonstração.")};$("#backReceive").onclick=()=>openModal("receive")});
 } else if(view==="transfer"){
  content.innerHTML=`<p class="helper">Simule uma transferência entre suas contas. Não insira dados bancários reais neste protótipo.</p><form id="transferForm"><div class="form-field"><label for="transferAmount">Valor (R$)</label><input id="transferAmount" inputmode="decimal" placeholder="10,00" required></div><div class="form-field"><label for="recipient">Destinatário de exemplo</label><select id="recipient"><option>Minha conta de teste</option><option>Outra conta de teste</option></select></div><button class="primary-button" type="submit">Simular transferência</button></form>`;
  $("#transferForm").addEventListener("submit",e=>{e.preventDefault();const amount=parseAmount($("#transferAmount").value);if(!amount){toast("Informe um valor válido maior que zero.");return}if(amount>balance){toast("Saldo de demonstração insuficiente. Simule um recebimento primeiro.");return}balance-=amount;transactions.unshift({type:"out",amount,label:"Transferência simulada",date:dateLabel()});renderBalance();renderTransactions();modal.close();toast("Transferência fictícia registrada. Nenhum dinheiro foi movimentado.")});
 } else if(view==="security"){
  content.innerHTML=`<div class="security-row"><span>✓</span><div><strong>Sem conexão bancária</strong><br><span class="helper">Este protótipo não acessa contas ou serviços financeiros.</span></div></div><div class="security-row"><span>✓</span><div><strong>Sem credenciais secretas</strong><br><span class="helper">Nunca coloque tokens de API dentro do app.</span></div></div><div class="security-row"><span>✓</span><div><strong>Confirmação antes de transferir</strong><br><span class="helper">Na versão real, a transferência deverá ser confirmada no servidor com validações de segurança.</span></div></div><div class="security-row"><span>!</span><div><strong>Dados apenas nesta sessão</strong><br><span class="helper">O saldo e o extrato são exemplos temporários e podem ser perdidos ao recarregar.</span></div></div><button class="primary-button" id="securityDone">Entendi</button>`;
  $("#securityDone").onclick=()=>modal.close();
 } else {modal.close();return}
 if(!modal.open)modal.showModal();
}
function parseAmount(raw){const normalized=String(raw).trim().replace(/\s/g,"").replace(/\./g,"").replace(",",".");const n=Number(normalized);return Number.isFinite(n)&&n>0&&n<=1000000?Math.round(n*100)/100:0}
document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>{const view=btn.dataset.view;if(view==="home"){modal.close();return}openModal(view);document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===view))}));
$("#closeModal").addEventListener("click",()=>modal.close());
$("#privacyBtn").addEventListener("click",()=>openModal("security"));
$("#toggleBalance").addEventListener("click",()=>{balanceVisible=!balanceVisible;renderBalance()});
$("#clearHistory").addEventListener("click",()=>{transactions=[];balance=0;renderBalance();renderTransactions();toast("Histórico de demonstração limpo.")});
modal.addEventListener("click",e=>{if(e.target===modal)modal.close()});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
renderBalance();renderTransactions();
