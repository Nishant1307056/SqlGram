const challengePool = [
 {id:"e1",level:"Easy",prompt:"List the first name, last name and salary of all employees earning more than 10000. Sort by salary from highest to lowest.",solution:"SELECT first_name, last_name, salary FROM employees WHERE salary > 10000 ORDER BY salary DESC, employee_id;"},
 {id:"e2",level:"Easy",prompt:"Find all employees who work in department 60. Show employee_id, first_name and job_title.",solution:"SELECT employee_id, first_name, job_title FROM employees WHERE department_id = 60 ORDER BY employee_id;"},
 {id:"e3",level:"Easy",prompt:"Show the distinct job titles available in the company, in alphabetical order.",solution:"SELECT DISTINCT job_title FROM employees ORDER BY job_title;"},
 {id:"e4",level:"Easy",prompt:"Display employees hired on or after 1 January 2007. Show employee_id, first_name and hire_date, sorted by hire date.",solution:"SELECT employee_id, first_name, hire_date FROM employees WHERE hire_date >= '2007-01-01' ORDER BY hire_date, employee_id;"},
 {id:"e5",level:"Easy",prompt:"Calculate the number of employees in each department. Show department_id and employee_count, sorted by department_id.",solution:"SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id ORDER BY department_id;"},
 {id:"i1",level:"Intermediate",prompt:"Show each department name and its employee count. Include departments with no employees. Sort by department_id.",solution:"SELECT d.department_name, COUNT(e.employee_id) AS employee_count FROM departments d LEFT JOIN employees e ON e.department_id=d.department_id GROUP BY d.department_id,d.department_name ORDER BY d.department_id;"},
 {id:"i2",level:"Intermediate",prompt:"List each employee's full name, department name and city. Include only employees whose department is located in India.",solution:"SELECT e.first_name || ' ' || e.last_name AS employee_name,d.department_name,l.city FROM employees e JOIN departments d ON d.department_id=e.department_id JOIN locations l ON l.location_id=d.location_id WHERE l.country='India' ORDER BY e.employee_id;"},
 {id:"i3",level:"Intermediate",prompt:"Find employees who earn more than the average salary of the entire company. Show employee_id, first_name and salary.",solution:"SELECT employee_id,first_name,salary FROM employees WHERE salary>(SELECT AVG(salary) FROM employees) ORDER BY salary DESC,employee_id;"},
 {id:"i4",level:"Intermediate",prompt:"For each country, show the number of departments located there. Return country and department_count.",solution:"SELECT l.country,COUNT(d.department_id) AS department_count FROM locations l JOIN departments d ON d.location_id=l.location_id GROUP BY l.country ORDER BY l.country;"},
 {id:"i5",level:"Intermediate",prompt:"Find departments whose average employee salary is greater than 9000. Show department_id and average_salary.",solution:"SELECT department_id,ROUND(AVG(salary),2) AS average_salary FROM employees GROUP BY department_id HAVING AVG(salary)>9000 ORDER BY department_id;"},
 {id:"h1",level:"Hard",prompt:"Rank employees within each department by salary from highest to lowest. Return employee_id, department_id, salary and salary_rank. Sort by department_id and rank.",solution:"SELECT employee_id,department_id,salary,RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM employees ORDER BY department_id,salary_rank,employee_id;"},
 {id:"h2",level:"Hard",prompt:"Use a CTE to calculate each department's average salary, then return employees earning above their own department's average. Show employee_id, first_name, department_id and salary.",solution:"WITH dept_avg AS (SELECT department_id,AVG(salary) AS avg_salary FROM employees GROUP BY department_id) SELECT e.employee_id,e.first_name,e.department_id,e.salary FROM employees e JOIN dept_avg a ON a.department_id=e.department_id WHERE e.salary>a.avg_salary ORDER BY e.department_id,e.salary DESC,e.employee_id;"},
 {id:"h3",level:"Hard",prompt:"Use a self join to list employees who earn more than their direct manager. Show employee_name, employee_salary, manager_name and manager_salary.",solution:"SELECT e.first_name || ' ' || e.last_name AS employee_name,e.salary AS employee_salary,m.first_name || ' ' || m.last_name AS manager_name,m.salary AS manager_salary FROM employees e JOIN employees m ON m.employee_id=e.manager_id WHERE e.salary>m.salary ORDER BY e.employee_id;"},
 {id:"h4",level:"Hard",prompt:"Find the second-highest distinct salary in the company. Return it as second_highest_salary.",solution:"SELECT MAX(salary) AS second_highest_salary FROM employees WHERE salary<(SELECT MAX(salary) FROM employees);"},
 {id:"h5",level:"Hard",prompt:"For each department, show the highest-paid employee or employees. Return department_id, employee_id, first_name and salary. Use a window function.",solution:"WITH ranked AS (SELECT department_id,employee_id,first_name,salary,DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM employees) SELECT department_id,employee_id,first_name,salary FROM ranked WHERE salary_rank=1 ORDER BY department_id,employee_id;"}
];
let activeChallenge=null, expectedResult=null, usedChallenges={Easy:[],Intermediate:[],Hard:[]}, completedCount=0;

const $ = id => document.getElementById(id);
let db=null, active=0, runs=0, pendingOpen=false;
function escapeHtml(v){return String(v??"NULL").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function setupDb(){
 db=new window.SQL.Database();
 // Classic SQL-learning schema: employees -> departments -> locations.
 db.run("CREATE TABLE locations (location_id INTEGER PRIMARY KEY, city TEXT NOT NULL, state_province TEXT, country TEXT);");
 db.run("INSERT INTO locations VALUES (1000,'New York','New York','USA'),(1100,'Dallas','Texas','USA'),(1200,'Chicago','Illinois','USA'),(1300,'Seattle','Washington','USA'),(1400,'London','England','UK'),(1500,'Mumbai','Maharashtra','India');");
 db.run("CREATE TABLE departments (department_id INTEGER PRIMARY KEY, department_name TEXT NOT NULL, manager_id INTEGER, location_id INTEGER, FOREIGN KEY(location_id) REFERENCES locations(location_id));");
 db.run("INSERT INTO departments VALUES (10,'Administration',200,1000),(20,'Marketing',201,1100),(30,'Purchasing',114,1200),(40,'Human Resources',203,1300),(50,'Shipping',121,1400),(60,'IT',103,1500),(70,'Finance',108,1000),(80,'Sales',145,1100);");
 db.run("CREATE TABLE employees (employee_id INTEGER PRIMARY KEY, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT, job_title TEXT, manager_id INTEGER, hire_date TEXT, salary REAL, commission_pct REAL, department_id INTEGER, FOREIGN KEY(department_id) REFERENCES departments(department_id));");
 db.run("INSERT INTO employees VALUES (100,'Steven','King','SKING','President',NULL,'2003-06-17',24000,NULL,10),(101,'Neena','Kochhar','NKOCHHAR','Administration VP',100,'2005-09-21',17000,NULL,10),(102,'Lex','De Haan','LDEHAAN','Administration VP',100,'2001-01-13',17000,NULL,10),(103,'Alexander','Hunold','AHUNOLD','IT Manager',102,'2006-01-03',9000,NULL,60),(104,'Bruce','Ernst','BERNST','Programmer',103,'2007-05-21',6000,NULL,60),(105,'David','Austin','DAUSTIN','Programmer',103,'2005-06-25',4800,NULL,60),(106,'Valli','Pataballa','VPATABAL','Programmer',103,'2006-02-05',4800,NULL,60),(107,'Diana','Lorentz','DLORENTZ','Programmer',103,'2007-02-07',4200,NULL,60),(108,'Nancy','Greenberg','NGREENBE','Finance Manager',101,'2002-08-17',12000,NULL,70),(109,'Daniel','Faviet','DFAVIET','Accountant',108,'2002-08-16',9000,NULL,70),(110,'John','Chen','JCHEN','Accountant',108,'2005-09-28',8200,NULL,70),(114,'Den','Raphaely','DRAPHAEL','Purchasing Manager',100,'2002-12-07',11000,NULL,30),(115,'Alexander','Khoo','AKHOO','Purchasing Clerk',114,'2003-05-18',3100,NULL,30),(120,'Matthew','Weiss','MWEISS','Shipping Manager',100,'2004-07-18',8000,NULL,50),(121,'Adam','Fripp','AFRIPP','Shipping Manager',100,'2005-04-10',8200,NULL,50),(145,'John','Russell','JRUSSEL','Sales Manager',100,'2004-10-01',14000,0.4,80),(146,'Karen','Partners','KPARTNER','Sales Representative',145,'2005-01-05',13500,0.3,80),(147,'Alberto','Errazuriz','AERRAZUR','Sales Representative',145,'2005-03-10',12000,0.3,80),(148,'Gerald','Cambrault','GCAMBRA','Sales Representative',145,'2007-10-15',11000,0.3,80),(149,'Eleni','Zlotkey','EZLOTKEY','Sales Representative',145,'2008-01-29',10500,0.2,80),(150,'Peter','Tucker','PTUCKER','Sales Representative',145,'2005-01-30',10000,0.3,80),(151,'David','Bernstein','DBERNSTE','Sales Representative',145,'2005-03-24',9500,0.25,80),(152,'Peter','Hall','PHALL','Sales Representative',145,'2005-08-20',9000,0.25,80),(153,'Christopher','Olsen','COLSEN','Sales Representative',145,'2006-03-30',8000,0.2,80),(154,'Nanette','Cambrault','NCAMBRA','Sales Representative',145,'2006-12-09',7500,0.2,80),(155,'Oliver','Tuvault','OTUVAULT','Sales Representative',145,'2007-11-23',7000,0.15,80),(156,'Janette','King','JKING','Sales Representative',145,'2004-01-30',10000,0.35,80),(157,'Patrick','Sully','PSULLY','Sales Representative',145,'2004-03-04',9500,0.35,80),(158,'Allan','McEwen','AMCEWEN','Sales Representative',145,'2004-08-01',9000,0.35,80),(159,'Lindsey','Smith','LSMITH','Sales Representative',145,'2005-03-10',8000,0.3,80),(160,'Louise','Doran','LDORAN','Sales Representative',145,'2005-12-15',7500,0.3,80),(161,'Sarath','Sewall','SSEWALL','Sales Representative',145,'2006-11-03',7000,0.25,80),(162,'Clara','Vishney','CVISHNEY','Sales Representative',145,'2005-11-11',10500,0.25,80),(163,'Danielle','Greene','DGREENE','Sales Representative',145,'2007-03-19',9500,0.15,80),(164,'Matthew','Marvins','MMARVINS','Sales Representative',145,'2008-01-24',7200,0.1,80),(165,'David','Lee','DLEE','Sales Representative',145,'2008-02-23',6800,0.1,80),(166,'Sundar','Ande','SANDE','Sales Representative',145,'2008-03-24',6400,0.1,80),(167,'Amit','Banda','ABANDA','Sales Representative',145,'2008-04-21',6200,0.1,80);");
}
function nextChallenge(level){
 const choices=challengePool.filter(c=>c.level===level);
 let used=usedChallenges[level];
 let remaining=choices.filter(c=>!used.includes(c.id));
 if(!remaining.length){used=[];usedChallenges[level]=used;remaining=choices.slice();}
 const pick=remaining[Math.floor(Math.random()*remaining.length)];
 usedChallenges[level].push(pick.id);activeChallenge=pick;expectedResult=db.exec(pick.solution);
 $("sqlChallenge").innerHTML="<strong>"+level+" challenge</strong><p>"+escapeHtml(pick.prompt)+"</p>";
 $("sqlEditor").value="";
 $("sqlResults").innerHTML="<p class='sqlIntro'>Run your SQL to inspect the result.</p>";
 $("sqlStatus").className="sqlStatus";
 $("sqlStatus").textContent="New random question. Write your SQL and run it to see output and validation.";
 updateStats();
}
function getDone(){const k="sqlgram-practice-"+(localStorage.getItem("uid")||"guest");return new Set(JSON.parse(localStorage.getItem(k)||"[]"));}
function saveDone(done){const k="sqlgram-practice-"+(localStorage.getItem("uid")||"guest");localStorage.setItem(k,JSON.stringify([...done]));}
function normalizeRows(rows){return rows.map(row=>JSON.stringify(row)).sort();}
function matchesExpected(result){
 if(!expectedResult||result.length!==expectedResult.length)return false;
 return result.every((r,i)=>{
  const e=expectedResult[i];
  if(JSON.stringify(r.columns)!==JSON.stringify(e.columns))return false;
  const actual=r.values.map(row=>row.map(v=>v instanceof Uint8Array?Array.from(v):v));
  const expected=e.values.map(row=>row.map(v=>v instanceof Uint8Array?Array.from(v):v));
  return JSON.stringify(normalizeRows(actual))===JSON.stringify(normalizeRows(expected));
 });
}
function setFeedback(type,message){const el=$("sqlStatus");el.className="sqlStatus sqlFeedback "+type;el.textContent=message;}
function validateCurrentQuery(){
 try{
  const q=$("sqlEditor").value.trim();if(!q)throw Error("Write a SQL query first.");
  const result=db.exec(q);runs++;renderResults(result);
  if(matchesExpected(result)){completedCount++;setFeedback("correct","✓ CORRECT — Your output matches this challenge.");}
  else{setFeedback("incorrect","✕ INCORRECT — Query executed, but the output does not match the expected answer. Your results are shown below.");}
  updateStats();
 }catch(e){setFeedback("error","⚠ QUERY FAILED — "+e.message);$("sqlResults").innerHTML="";}
}
function checkChallenge(){validateCurrentQuery();}
function updateStats(){$("sqlStats").textContent=completedCount+" correct answers · "+runs+" queries run · SQLite";}
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
function openLab(){ const panel=$("sqlLab"); if(panel) panel.hidden=false; pendingOpen=true; closeDrawerSafe(); }
function closeDrawerSafe(){const d=$("drawer"),s=$("drawerShade"),m=$("menuBtn");if(d){d.classList.remove("open");d.setAttribute("aria-hidden","true");}if(s)s.hidden=true;if(m)m.setAttribute("aria-expanded","false");}
function init(){
 const panel=document.createElement("section");panel.id="sqlLab";panel.hidden=true;panel.innerHTML=`
 <div class="sqlTop"><h2>SQL Practice Lab</h2><button id="sqlClose">Close ✕</button></div>
 <p class="sqlIntro">Write and execute real SQLite queries in your browser. No server, account data or paid API is used by the SQL engine.</p>
 <div class="sqlGrid">
  <div class="sqlPanel"><h3>Choose difficulty</h3><select id="sqlLevel"><option>Easy</option><option>Intermediate</option><option>Hard</option></select><button class="sqlAction primary" id="sqlNext">Generate random question</button><div class="sqlPrompt" id="sqlChallenge"></div><div class="sqlStats" id="sqlStats">Choose a level to begin · SQLite</div></div>
  <div class="sqlPanel"><h3>Database tables</h3><p class="sqlIntro"><strong>Core SQL practice schema</strong></p><p class="sqlIntro">employees (employee_id, first_name, last_name, email, job_title, manager_id, hire_date, salary, commission_pct, department_id)</p><p class="sqlIntro">departments (department_id, department_name, manager_id, location_id)</p><p class="sqlIntro">locations (location_id, city, state_province, country)</p><p class="sqlIntro">Relationships: employees.department_id → departments.department_id → locations.location_id</p><button class="sqlAction" id="sqlReset">Reset sample database</button></div>
  <div class="sqlPanel sqlWide"><h3>Your SQL query</h3><textarea id="sqlEditor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea><div class="sqlToolbar"><button class="sqlAction primary" id="sqlRun">▶ Run query</button><button class="sqlAction" id="sqlSave">Save query</button><button class="sqlAction" id="sqlClear">Clear</button></div><p class="sqlStatus" id="sqlStatus" role="status"></p></div>
  <div class="sqlPanel sqlWide"><h3>Query results</h3><div class="sqlResults" id="sqlResults"><p class="sqlIntro">Run a query to see the output here.</p></div></div>
  <div class="sqlPanel sqlWide"><h3>My saved queries</h3><div class="sqlSaved" id="sqlSaved"></div></div>
 </div>`;
 document.body.append(panel);
 if(pendingOpen) panel.hidden=false;
 const level=$("sqlLevel");$("sqlNext").onclick=()=>nextChallenge(level.value);level.onchange=()=>nextChallenge(level.value);
 $("sqlClose").onclick=()=>panel.hidden=true;
 $("sqlRun").onclick=validateCurrentQuery;
 $("sqlClear").onclick=()=>{$("sqlEditor").value="";$("sqlStatus").textContent="Editor cleared.";};
 $("sqlSave").onclick=saveQuery;
 $("sqlReset").onclick=()=>{setupDb();usedChallenges={Easy:[],Intermediate:[],Hard:[]};nextChallenge(level.value);$("sqlStatus").textContent="Employee, department and location sample data reset.";};
 $("sqlSaved").onclick=e=>{const b=e.target.closest("[data-query]");if(!b)return;const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");const items=JSON.parse(localStorage.getItem(key)||"[]");$("sqlEditor").value=items[Number(b.dataset.query)]?.sql||"";};
 setupDb();nextChallenge("Easy");renderSaved();
 window.__openSqlLab=openLab;
}
function loadEngine(){
 if(window.initSqlJs){window.initSqlJs({locateFile:file=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+file}).then(SQL=>{window.SQL=SQL;init();}).catch(e=>{console.error(e);fallback();});return;}
 const s=document.createElement("script");s.src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js";s.onload=()=>window.initSqlJs({locateFile:file=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/"+file}).then(SQL=>{window.SQL=SQL;init();}).catch(fallback);s.onerror=fallback;document.head.append(s);
}
function fallback(){
 const panel=document.createElement("section");
 panel.id="sqlLab";
 panel.hidden=!pendingOpen;
 panel.innerHTML='<div class="sqlTop"><h2>SQL Practice Lab</h2><button id="sqlFallbackClose">Close ✕</button></div><p>Could not load the free SQLite engine. Check your internet connection and reopen the lab.</p>';
 document.body.append(panel);
 panel.querySelector("#sqlFallbackClose").addEventListener("click",()=>panel.hidden=true);
}
window.__openSqlLab=openLab;
loadEngine();
