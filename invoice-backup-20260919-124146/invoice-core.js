(function(root){
'use strict';
function scaled(value,digits,max){
 const s=String(value).trim();
 if(!new RegExp('^\\d+(?:\\.\\d{1,'+digits+'})?$').test(s))throw new Error('Enter valid non-negative numbers with no more than '+digits+' decimal places.');
 const parts=s.split('.');const n=Number(parts[0])*10**digits+Number((parts[1]||'').padEnd(digits,'0'));
 if(!Number.isSafeInteger(n)||n>max*10**digits)throw new Error('An amount is too large.');return n;
}
function totals(items,discount,tax){
 if(!items.length||items.length>50)throw new Error('Add between 1 and 50 items.');
 let subtotal=0;
 const lines=items.map(item=>{const q=scaled(item.quantity,3,10000),p=scaled(item.price,2,1000000);if(q===0)throw new Error('Quantity must be greater than zero.');const amount=Math.round(q*p/1000);subtotal+=amount;return amount;});
 if(subtotal>10000000000)throw new Error('Invoice total must not exceed 100,000,000.');
 const off=scaled(discount||'0',2,100000000);if(off>subtotal)throw new Error('Discount cannot exceed the subtotal.');
 const rate=scaled(tax||'0',2,100),base=subtotal-off,taxAmount=Math.round(base*rate/10000);
 return {lines,subtotal,discount:off,tax:taxAmount,total:base+taxAmount};
}
function parseUsage(raw){if(raw===null)return 0;const n=Number(raw);if(!Number.isInteger(n)||n<0||n>3)throw new Error('Trial record is invalid. Please contact us.');return n;}
const api={totals,parseUsage};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.InvoiceCore=api;
})(typeof globalThis!=='undefined'?globalThis:this);
