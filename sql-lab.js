const challenges = [
 {name:"1. Select all customers",level:"Beginner",prompt:"Return every column from the customers table.",starter:"SELECT *\nFROM customers;",check:/select\s+\*\s+from\s+customers/i},
 {name:"2. Filter by city",level:"Beginner",prompt:"Return the names of customers who live in Kolkata.",starter:"SELECT name\nFROM customers\nWHERE city = 'Kolkata';",check:/where\s+city\s*=\s*'Kolkata'/i},
 {name:"3. Sort products",level:"Beginner",prompt:"Show product names and prices from highest to lowest price.",starter:"SELECT name, price\nFROM products\nORDER BY price DESC;",check:/order\s+by\s+price\s+desc/i},
 {name:"4. Count orders",level:"Beginner",prompt:"Return the total number of orders.",starter:"SELECT COUNT(*) AS total_orders\nFROM orders;",check:/count\s*\(\s*\*\s*\)/i},
 {name:"5. Group by status",level:"Intermediate",prompt:"Show each order status and the number of orders in that status.",starter:"SELECT status, COUNT(*) AS order_count\nFROM orders\nGROUP BY status;",check:/group\s+by\s+status/i},
 {name:"6. Join customers and orders",level:"Intermediate",prompt:"Show each customer's name alongside their order total.",starter:"SELECT c.name, o.total\nFROM customers c\nJOIN orders o ON o.customer_id = c.id;",check:/join\s+orders/i},
 {name:"7. Find customers without orders",level:"Intermediate",prompt:"Use a LEFT JOIN to find customers who have no matching order.",starter:"SELECT c.name\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;",check:/left\s+join/i},
 {name:"8. Use a CTE",level:"Advanced",prompt:"Use a CTE to calculate total spend per customer, then return totals above 200.",starter:"WITH spend AS (\n  SELECT customer_id, SUM(total) AS total_spent\n  FROM orders\n  GROUP BY customer_id\n)\nSELECT * FROM spend WHERE total_spent > 200;",check:/with\s+\w+\s+as\s*\(/i}
];
const $ = id => document.getElementById(id);
let db=null, active=0, runs=0;
function escapeHtml(v){return String(v??"NULL").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function setupDb(){
 db=new window.SQL.Database();
 db.run("CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, city TEXT); INSERT INTO customers VALUES (1,'Asha',34,'Kolkata'),(2,'Ben',28,'Leeds'),(3,'Chen',41,'Leeds'),(4,'Arun',31,'Kolkata');");
 db.run("CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL, category TEXT); INSERT INTO products VALUES (1,'Laptop',899,'Electronics'),(2,'Phone',499,'Electronics'),(3,'Desk',220,'Furniture'),(4,'Chair',85,'Furniture');");
 db.run("CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, status TEXT, total REAL); INSERT INTO orders VALUES (1,1,'paid',250),(2,3,'shipped',90),(3,1,'paid',120),(4,4,'pending',75),(5,3,'paid',160);");
}
function renderChallenge(){const c=challenges[active];$("sqlChallenge").innerHTML="<strong>"+escapeHtml(c.name)+" · "+c.level+"</strong><p>"+escapeHtml(c.prompt)+"</p>";$("sqlEditor").value=c.starter;$("sqlStatus").textContent="Ready. Your database contains customers, products and orders sample tables.";}
function renderResults(result){
 if(!result.length){$("sqlResults").innerHTML="<p class='sqlIntro'>Query executed successfully. No result set was returned.</p>";return;}
 $("sqlResults").innerHTML=result.map(r=>{const cols=r.columns||[];return "<table><thead><tr>"+cols.map(c=>"<th>"+escapeHtml(c)+"</th>").join("")+"</tr></thead><tbody>"+r.values.map(row=>"<tr>"+row.map(v=>"<td>"+escapeHtml(v)+"</td>").join("")+"</tr>").join("")+"</tbody></table>";}).join("");
}
function saveQuery(){
 const name=prompt("Name this query");if(!name)return;
 const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");
 const items=JSON.parse(localStorage.getItem(key)||"[]");items.unshift({name,sql:$("sqlEditor").value});localStorage.setItem(key,JSON.stringify(items.slice(0,30)));renderSaved();
}
function renderSaved(){const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");const items=JSON.parse(localStorage.getItem(key)||"[]");$("sqlSaved").innerHTML=items.length?items.map((x,i)=>"<button class='sqlAction' data-query='"+i+"'>"+escapeHtml(x.name)+"</button>").join(""):"<span class='sqlIntro'>Your saved queries will appear here.</span>";}
function openLab(){ $("sqlLab").hidden=false;closeDrawerSafe(); }
function closeDrawerSafe(){const d=$("drawer"),s=$("drawerShade"),m=$("menuBtn");if(d){d.classList.remove("open");d.setAttribute("aria-hidden","true");}if(s)s.hidden=true;if(m)m.setAttribute("aria-expanded","false");}
function init(){
 const panel=document.createElement("section");panel.id="sqlLab";panel.hidden=true;panel.innerHTML=`
 <div class="sqlTop"><h2>SQL Practice Lab</h2><button id="sqlClose">Close ✕</button></div>
 <p class="sqlIntro">Write and execute real SQLite queries in your browser. No server, account data or paid API is used by the SQL engine.</p>
 <div class="sqlGrid">
  <div class="sqlPanel"><h3>Choose a challenge</h3><select id="sqlChallengeSelect"></select><div class="sqlPrompt" id="sqlChallenge"></div><div class="sqlStats" id="sqlStats">Sample database · SQLite</div></div>
  <div class="sqlPanel"><h3>Database tables</h3><p class="sqlIntro">customers (id, name, age, city)</p><p class="sqlIntro">products (id, name, price, category)</p><p class="sqlIntro">orders (id, customer_id, status, total)</p><button class="sqlAction" id="sqlReset">Reset sample database</button></div>
  <div class="sqlPanel sqlWide"><h3>Your SQL query</h3><textarea id="sqlEditor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea><div class="sqlToolbar"><button class="sqlAction primary" id="sqlRun">▶ Run query</button><button class="sqlAction" id="sqlStarter">Load starter</button><button class="sqlAction" id="sqlSave">Save query</button><button class="sqlAction" id="sqlClear">Clear</button></div><p class="sqlStatus" id="sqlStatus" role="status"></p></div>
  <div class="sqlPanel sqlWide"><h3>Query results</h3><div class="sqlResults" id="sqlResults"><p class="sqlIntro">Run a query to see the output here.</p></div></div>
  <div class="sqlPanel sqlWide"><h3>My saved queries</h3><div class="sqlSaved" id="sqlSaved"></div></div>
 </div>`;
 document.body.append(panel);
 const select=$("sqlChallengeSelect");challenges.forEach((c,i)=>{const o=document.createElement("option");o.value=i;o.textContent=c.name+" ("+c.level+")";select.append(o);});
 $("sqlClose").onclick=()=>panel.hidden=true;
 $("sqlRun").onclick=()=>{try{const q=$("sqlEditor").value.trim();if(!q)throw Error("Write a SQL query first.");const out=db.exec(q);runs++;renderResults(out);$("sqlStatus").textContent="Executed successfully · "+runs+" queries run this session.";const c=challenges[active];if(c.check.test(q)){$("sqlStatus").textContent+=" Challenge pattern detected — compare your result with the prompt.";const k="sqlgram-practice-"+(localStorage.getItem("uid")||"guest");const done=new Set(JSON.parse(localStorage.getItem(k)||"[]"));done.add(active);localStorage.setItem(k,JSON.stringify([...done]));$("sqlStats").textContent=done.size+" of "+challenges.length+" challenge patterns attempted · SQLite";}}catch(e){$("sqlStatus").textContent="SQL error: "+e.message;$("sqlResults").innerHTML="";}};
 $("sqlStarter").onclick=renderChallenge;
 $("sqlClear").onclick=()=>{$("sqlEditor").value="";$("sqlStatus").textContent="Editor cleared.";};
 $("sqlSave").onclick=saveQuery;
 $("sqlReset").onclick=()=>{setupDb();$("sqlStatus").textContent="Sample database reset to its original data.";};
 select.onchange=()=>{active=Number(select.value);renderChallenge();};
 $("sqlSaved").onclick=e=>{const b=e.target.closest("[data-query]");if(!b)return;const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");const items=JSON.parse(localStorage.getItem(key)||"[]");$("sqlEditor").value=items[Number(b.dataset.query)]?.sql||"";};
 setupDb();renderChallenge();renderSaved();
 window.__openSqlLab=openLab;
}
function loadEngine(){
 if(window.initSqlJs){window.initSqlJs({locateFile:file=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+file}).then(SQL=>{window.SQL=SQL;init();}).catch(e=>{console.error(e);fallback();});return;}
 const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";s.onload=()=>window.initSqlJs({locateFile:file=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+file}).then(SQL=>{window.SQL=SQL;init();}).catch(fallback);s.onerror=fallback;document.head.append(s);
}
function fallback(){const panel=document.createElement("section");panel.id="sqlLab";panel.innerHTML="<div class='sqlTop'><h2>SQL Practice Lab</h2><button onclick='this.closest("section").hidden=true'>Close ✕</button></div><p>Could not load the free SQLite engine. Check your internet connection and reopen the lab.</p>";document.body.append(panel);window.__openSqlLab=()=>panel.hidden=false;}
loadEngine();
