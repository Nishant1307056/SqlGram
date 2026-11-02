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
 ,
 {id:"e6",level:"Easy",prompt:"Find employees who receive a commission. Show employee_id, first_name and commission_pct.",solution:"SELECT employee_id,first_name,commission_pct FROM employees WHERE commission_pct IS NOT NULL ORDER BY employee_id;"},
 {id:"e7",level:"Easy",prompt:"Find employees whose last name ends with the letter 'n'. Show first_name and last_name.",solution:"SELECT first_name,last_name FROM employees WHERE last_name LIKE '%n' ORDER BY last_name,first_name;"},
 {id:"e8",level:"Easy",prompt:"Display every employee's full name in a single column called full_name.",solution:"SELECT first_name || ' ' || last_name AS full_name FROM employees ORDER BY employee_id;"},
 {id:"e9",level:"Easy",prompt:"How many employees are present in the company? Return one column called total_employees.",solution:"SELECT COUNT(*) AS total_employees FROM employees;"},
 {id:"e10",level:"Easy",prompt:"List all department names in reverse alphabetical order.",solution:"SELECT department_name FROM departments ORDER BY department_name DESC;"},
 {id:"e11",level:"Easy",prompt:"Find employees hired between 1 January 2005 and 31 December 2006, inclusive. Show their names and hire dates.",solution:"SELECT first_name,last_name,hire_date FROM employees WHERE hire_date BETWEEN '2005-01-01' AND '2006-12-31' ORDER BY hire_date,employee_id;"},
 {id:"e12",level:"Easy",prompt:"Show every distinct salary paid in the company, from lowest to highest.",solution:"SELECT DISTINCT salary FROM employees ORDER BY salary;"},
 {id:"e13",level:"Easy",prompt:"Find employees who do not have a manager. Show employee_id and full name.",solution:"SELECT employee_id,first_name || ' ' || last_name AS full_name FROM employees WHERE manager_id IS NULL ORDER BY employee_id;"},
 {id:"e14",level:"Easy",prompt:"List the city and country for every office location, without duplicate rows.",solution:"SELECT DISTINCT city,country FROM locations ORDER BY country,city;"},
 {id:"e15",level:"Easy",prompt:"Show the five most recently hired employees with their names and hire dates.",solution:"SELECT first_name,last_name,hire_date FROM employees ORDER BY hire_date DESC,employee_id DESC LIMIT 5;"},
 {id:"e16",level:"Easy",prompt:"Find all employees whose job title is Programmer. Show their names and department IDs.",solution:"SELECT first_name,last_name,department_id FROM employees WHERE job_title='Programmer' ORDER BY last_name,first_name;"},
 {id:"e17",level:"Easy",prompt:"For each job title, show the number of employees with that title.",solution:"SELECT job_title,COUNT(*) AS employee_count FROM employees GROUP BY job_title ORDER BY job_title;"},
 {id:"i6",level:"Intermediate",prompt:"Display every department with its office city and country. Show department name, city and country.",solution:"SELECT d.department_name,l.city,l.country FROM departments d JOIN locations l ON l.location_id=d.location_id ORDER BY d.department_id;"},
 {id:"i7",level:"Intermediate",prompt:"Find job titles held by at least three employees. Show the job title and employee count.",solution:"SELECT job_title,COUNT(*) AS employee_count FROM employees GROUP BY job_title HAVING COUNT(*)>=3 ORDER BY employee_count DESC,job_title;"},
 {id:"i8",level:"Intermediate",prompt:"For employees who earn commission, calculate their total pay as salary plus salary multiplied by commission_pct. Show name, salary, commission_pct and total_pay.",solution:"SELECT first_name || ' ' || last_name AS employee_name,salary,commission_pct,ROUND(salary+(salary*commission_pct),2) AS total_pay FROM employees WHERE commission_pct IS NOT NULL ORDER BY total_pay DESC,employee_id;"},
 {id:"i9",level:"Intermediate",prompt:"Show each employee's name alongside their direct manager's name. Exclude employees who do not have a manager.",solution:"SELECT e.first_name || ' ' || e.last_name AS employee_name,m.first_name || ' ' || m.last_name AS manager_name FROM employees e JOIN employees m ON m.employee_id=e.manager_id ORDER BY e.employee_id;"},
 {id:"i10",level:"Intermediate",prompt:"For each country, calculate the average salary of employees working in departments located there. Return country and average_salary.",solution:"SELECT l.country,ROUND(AVG(e.salary),2) AS average_salary FROM employees e JOIN departments d ON d.department_id=e.department_id JOIN locations l ON l.location_id=d.location_id GROUP BY l.country ORDER BY l.country;"},
 {id:"i11",level:"Intermediate",prompt:"Calculate the total salary expense for each department. Show department name and total_salary, sorted from highest expense to lowest.",solution:"SELECT d.department_name,SUM(e.salary) AS total_salary FROM departments d JOIN employees e ON e.department_id=d.department_id GROUP BY d.department_id,d.department_name ORDER BY total_salary DESC,d.department_id;"},
 {id:"i12",level:"Intermediate",prompt:"Find employees whose salary is greater than the average salary in their own department. Use a correlated subquery.",solution:"SELECT e.employee_id,e.first_name,e.department_id,e.salary FROM employees e WHERE e.salary>(SELECT AVG(x.salary) FROM employees x WHERE x.department_id=e.department_id) ORDER BY e.department_id,e.salary DESC,e.employee_id;"},
 {id:"i13",level:"Intermediate",prompt:"List employees who work in offices located in the UK or USA. Show employee name, department and country.",solution:"SELECT e.first_name || ' ' || e.last_name AS employee_name,d.department_name,l.country FROM employees e JOIN departments d ON d.department_id=e.department_id JOIN locations l ON l.location_id=d.location_id WHERE l.country IN ('UK','USA') ORDER BY l.country,e.employee_id;"},
 {id:"i14",level:"Intermediate",prompt:"Find departments that currently have no employees. Return department_id and department_name.",solution:"SELECT d.department_id,d.department_name FROM departments d LEFT JOIN employees e ON e.department_id=d.department_id WHERE e.employee_id IS NULL ORDER BY d.department_id;"},
 {id:"i15",level:"Intermediate",prompt:"For each job title, show the highest salary paid for that role. Return job_title and highest_salary.",solution:"SELECT job_title,MAX(salary) AS highest_salary FROM employees GROUP BY job_title ORDER BY highest_salary DESC,job_title;"},
 {id:"i16",level:"Intermediate",prompt:"Find the earliest hire date in each department. Show department_id and first_hire_date.",solution:"SELECT department_id,MIN(hire_date) AS first_hire_date FROM employees GROUP BY department_id ORDER BY department_id;"},
 {id:"i17",level:"Intermediate",prompt:"Show the number of employees hired in each calendar year. Return hire_year and hires.",solution:"SELECT substr(hire_date,1,4) AS hire_year,COUNT(*) AS hires FROM employees GROUP BY substr(hire_date,1,4) ORDER BY hire_year;"},
 {id:"h6",level:"Hard",prompt:"Use ROW_NUMBER to return the two highest-paid employees in every department. Show department_id, employee_id, salary and salary_position.",solution:"WITH ranked AS (SELECT department_id,employee_id,salary,ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC,employee_id) AS salary_position FROM employees) SELECT department_id,employee_id,salary,salary_position FROM ranked WHERE salary_position<=2 ORDER BY department_id,salary_position;"},
 {id:"h7",level:"Hard",prompt:"Calculate a running total of salaries within each department, ordered by employee ID. Return department_id, employee_id, salary and running_salary.",solution:"SELECT department_id,employee_id,salary,SUM(salary) OVER(PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_salary FROM employees ORDER BY department_id,employee_id;"},
 {id:"h8",level:"Hard",prompt:"Use a CTE to calculate the company-wide average salary, then show each employee's salary difference from that average. Include employees earning below or above average.",solution:"WITH company_avg AS (SELECT AVG(salary) AS avg_salary FROM employees) SELECT e.employee_id,e.first_name,e.salary,ROUND(e.salary-a.avg_salary,2) AS salary_difference FROM employees e CROSS JOIN company_avg a ORDER BY salary_difference DESC,e.employee_id;"},
 {id:"h9",level:"Hard",prompt:"Use CTEs to identify departments whose average salary is higher than the company's overall average salary. Return department_id and department_avg_salary.",solution:"WITH company_avg AS (SELECT AVG(salary) AS avg_salary FROM employees),dept_avg AS (SELECT department_id,AVG(salary) AS avg_salary FROM employees GROUP BY department_id) SELECT d.department_id,ROUND(d.avg_salary,2) AS department_avg_salary FROM dept_avg d CROSS JOIN company_avg c WHERE d.avg_salary>c.avg_salary ORDER BY d.department_id;"},
 {id:"h10",level:"Hard",prompt:"Find pairs of employees who share both the same department and the same job title. Return department_id, job_title, employee_one_id and employee_two_id. Do not return mirrored pairs.",solution:"SELECT a.department_id,a.job_title,a.employee_id AS employee_one_id,b.employee_id AS employee_two_id FROM employees a JOIN employees b ON b.department_id=a.department_id AND b.job_title=a.job_title AND b.employee_id>a.employee_id ORDER BY a.department_id,a.job_title,a.employee_id,b.employee_id;"},
 {id:"h11",level:"Hard",prompt:"For every employee, calculate the difference between their salary and their department's average salary using a window function. Return employee_id, department_id, salary and difference_from_department_avg.",solution:"SELECT employee_id,department_id,salary,ROUND(salary-AVG(salary) OVER(PARTITION BY department_id),2) AS difference_from_department_avg FROM employees ORDER BY department_id,employee_id;"},
 {id:"h12",level:"Hard",prompt:"Use a window function to find the most recently hired employee in each department. If multiple employees share the latest hire date, include all of them.",solution:"WITH latest AS (SELECT department_id,employee_id,first_name,hire_date,RANK() OVER(PARTITION BY department_id ORDER BY hire_date DESC) AS hire_rank FROM employees) SELECT department_id,employee_id,first_name,hire_date FROM latest WHERE hire_rank=1 ORDER BY department_id,employee_id;"},
 {id:"h13",level:"Hard",prompt:"Rank employees who receive commission by commission percentage, highest first. Return employee_id, first_name, commission_pct and commission_rank.",solution:"SELECT employee_id,first_name,commission_pct,DENSE_RANK() OVER(ORDER BY commission_pct DESC) AS commission_rank FROM employees WHERE commission_pct IS NOT NULL ORDER BY commission_rank,employee_id;"},
 {id:"h14",level:"Hard",prompt:"Use a CTE and ranking to return the three departments with the highest average salary. Show department_id, average_salary and position.",solution:"WITH dept_avg AS (SELECT department_id,AVG(salary) AS average_salary FROM employees GROUP BY department_id),ranked AS (SELECT department_id,average_salary,DENSE_RANK() OVER(ORDER BY average_salary DESC) AS position FROM dept_avg) SELECT department_id,ROUND(average_salary,2) AS average_salary,position FROM ranked WHERE position<=3 ORDER BY position,department_id;"},
 {id:"h15",level:"Hard",prompt:"Divide employees into four salary quartiles using NTILE. Return employee_id, salary and salary_quartile, where 1 is the highest-paid group.",solution:"SELECT employee_id,salary,NTILE(4) OVER(ORDER BY salary DESC,employee_id) AS salary_quartile FROM employees ORDER BY salary_quartile,employee_id;"},
 {id:"h16",level:"Hard",prompt:"Use a CTE to count direct reports for every manager. Return manager_id and direct_report_count for managers with at least one direct report.",solution:"WITH report_counts AS (SELECT manager_id,COUNT(*) AS direct_report_count FROM employees WHERE manager_id IS NOT NULL GROUP BY manager_id) SELECT manager_id,direct_report_count FROM report_counts ORDER BY direct_report_count DESC,manager_id;"},
 {id:"h17",level:"Hard",prompt:"Find employees whose salary is the maximum within their department, including ties. Solve this using a correlated subquery.",solution:"SELECT e.department_id,e.employee_id,e.first_name,e.salary FROM employees e WHERE e.salary=(SELECT MAX(x.salary) FROM employees x WHERE x.department_id=e.department_id) ORDER BY e.department_id,e.employee_id;"}

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
let lastGeneratedKey="";
const questionDecks={Easy:[],Intermediate:[],Hard:[]};
const lastQuestionByLevel={Easy:null,Intermediate:null,Hard:null};
const seenQuestionIds={Easy:new Set(),Intermediate:new Set(),Hard:new Set()};
let historyReady=false, historySaveQueue=Promise.resolve(), activeQuestionRecorded=false;
const emptyMetrics=()=>({attempts:0,correct:0,incorrect:0,uniqueQuestions:[],byLevel:{Easy:{attempts:0,correct:0},Intermediate:{attempts:0,correct:0},Hard:{attempts:0,correct:0}},byConcept:{},recent:[]});
let practiceMetrics=emptyMetrics();
let hintStep=0,timerHandle=null,timerSeconds=0,timerMode="",timedScore=0;
function getConcept(c){return conceptByQuestion[c.id]||"Other";}
function renderConceptOptions(){const sel=$("sqlConcept"),old=sel.value,names=[...new Set(challengePool.map(getConcept))].sort();sel.innerHTML='<option value="">All concepts</option>'+names.map(n=>'<option>'+escapeHtml(n)+'</option>').join("");if(names.includes(old))sel.value=old;}
function getPracticeChoices(level){const c=$("sqlConcept").value;return challengePool.filter(q=>q.level===level&&(!c||getConcept(q)===c));}
function showHint(){if(!activeChallenge)return;const hints=["Identify the output columns and the tables needed.","Map the requested result to SQL clauses: WHERE, JOIN, GROUP BY, HAVING or window functions.","Build the query in small steps and compare the result shape with the prompt."];hintStep=Math.min(hintStep+1,3);$("sqlHintBox").hidden=false;$("sqlHintBox").textContent="Hint "+hintStep+" of 3: "+hints[hintStep-1];}
function stopSqlTimer(){if(timerHandle){clearInterval(timerHandle);timerHandle=null;}}
function startSqlTimer(minutes,mode){stopSqlTimer();timerMode=mode;timerSeconds=minutes*60;timedScore=0;const draw=()=>$("sqlTimer").textContent=mode+" · "+String(Math.floor(timerSeconds/60)).padStart(2,"0")+":"+String(timerSeconds%60).padStart(2,"0");draw();timerHandle=setInterval(()=>{timerSeconds--;draw();if(timerSeconds<=0){stopSqlTimer();$("sqlTimer").textContent="Time is up · "+timedScore+" correct";setFeedback("error",mode+" finished. Score: "+timedScore);}},1000);}

const conceptByQuestion={
 e1:"Filtering & sorting",e2:"Filtering & sorting",e3:"DISTINCT",e4:"Date filtering",e5:"GROUP BY & aggregation",
 e6:"NULL handling",e7:"Pattern matching",e8:"String operations",e9:"Aggregate functions",e10:"Sorting",e11:"Date filtering",e12:"DISTINCT",e13:"NULL handling",e14:"DISTINCT",e15:"LIMIT & sorting",e16:"Filtering",e17:"GROUP BY & aggregation",
 i1:"LEFT JOIN",i2:"Multi-table JOIN",i3:"Scalar subqueries",i4:"JOIN & aggregation",i5:"HAVING",i6:"JOIN",i7:"HAVING",i8:"Calculated columns",i9:"Self JOIN",i10:"Multi-table aggregation",i11:"JOIN & aggregation",i12:"Correlated subqueries",i13:"Multi-table JOIN",i14:"Anti JOIN",i15:"GROUP BY & aggregation",i16:"MIN & grouping",i17:"Date aggregation",
 h1:"Window ranking",h2:"CTE & aggregation",h3:"Self JOIN",h4:"Nested subqueries",h5:"Window ranking",h6:"ROW_NUMBER",h7:"Window running totals",h8:"CTE & scalar aggregation",h9:"Multiple CTEs",h10:"Self JOIN pairs",h11:"Window aggregates",h12:"RANK",h13:"DENSE_RANK",h14:"CTE & ranking",h15:"NTILE",h16:"CTE & grouping",h17:"Correlated subqueries"
};
function normalizeMetrics(raw){
 const base=emptyMetrics();if(!raw||typeof raw!=="object")return base;
 for(const k of ["attempts","correct","incorrect"])base[k]=Number(raw[k])||0;
 base.uniqueQuestions=Array.isArray(raw.uniqueQuestions)?raw.uniqueQuestions:[];
 for(const level of Object.keys(base.byLevel)){const x=raw.byLevel?.[level]||{};base.byLevel[level]={attempts:Number(x.attempts)||0,correct:Number(x.correct)||0};}
 base.byConcept=raw.byConcept&&typeof raw.byConcept==="object"?raw.byConcept:{};
 base.recent=Array.isArray(raw.recent)?raw.recent.slice(0,12):[];
 return base;
}
function practicePayload(){return {seenByLevel:{Easy:[...seenQuestionIds.Easy],Intermediate:[...seenQuestionIds.Intermediate],Hard:[...seenQuestionIds.Hard]},metrics:practiceMetrics};}
function persistMetrics(){
 localStorage.setItem("sqlgram-metrics-"+(localStorage.getItem("uid")||"guest"),JSON.stringify(practiceMetrics));
 const payload=practicePayload();
 if(window.__sqlGramPracticeHistory)historySaveQueue=historySaveQueue.then(()=>window.__sqlGramPracticeHistory.save(payload)).catch(e=>console.warn("Could not sync practice metrics.",e));
 renderDashboard();
}
function recordAttempt(challenge,isCorrect){
 const level=challenge.level,concept=conceptByQuestion[challenge.id]||"Other";
 practiceMetrics.attempts++;
 if(isCorrect){practiceMetrics.correct++;practiceMetrics.byLevel[level].correct++;}
 else{practiceMetrics.incorrect++;}
 practiceMetrics.byLevel[level].attempts++;
 if(!practiceMetrics.uniqueQuestions.includes(challenge.id))practiceMetrics.uniqueQuestions.push(challenge.id);
 const item={id:challenge.id,level,concept,prompt:challenge.prompt.slice(0,110),correct:isCorrect,at:Date.now()};
 practiceMetrics.recent.unshift(item);practiceMetrics.recent=practiceMetrics.recent.slice(0,12);
 const c=practiceMetrics.byConcept[concept]||{attempts:0,correct:0};
 c.attempts++;if(isCorrect)c.correct++;practiceMetrics.byConcept[concept]=c;
 persistMetrics();
}
function renderDashboard(){
 const m=practiceMetrics,accuracy=m.attempts?Math.round(m.correct/m.attempts*100):0;
 const cards=[["Query attempts",m.attempts],["Unique questions",m.uniqueQuestions.length],["Correct answers",m.correct],["Overall accuracy",accuracy+"%"]];
 $("sqlMetricGrid").innerHTML=cards.map(([label,value])=>"<div class='sqlMetric'><span>"+label+"</span><strong>"+value+"</strong></div>").join("");
 $("sqlLevelProgress").innerHTML=["Easy","Intermediate","Hard"].map(level=>{const x=m.byLevel[level],pct=x.attempts?Math.round(x.correct/x.attempts*100):0;return "<div class='sqlLevelRow'><div><strong>"+level+"</strong><span>"+x.correct+" / "+x.attempts+" correct · "+pct+"%</span></div><div class='sqlProgressTrack'><i style='width:"+pct+"%'></i></div></div>";}).join("");
 const weak=Object.entries(m.byConcept).filter(([,x])=>x.attempts>=2).sort((a,b)=>(a[1].correct/a[1].attempts)-(b[1].correct/b[1].attempts)).slice(0,4);
 $("sqlWeakConcepts").innerHTML=weak.length?weak.map(([name,x])=>"<div class='sqlMiniRow'><span>"+escapeHtml(name)+"</span><strong>"+Math.round(x.correct/x.attempts*100)+"% accuracy</strong></div>").join(""):"<p class='sqlIntro'>Concept insights will appear after you practise a few questions.</p>";
 $("sqlRecentActivity").innerHTML=m.recent.length?m.recent.slice(0,5).map(x=>"<div class='sqlMiniRow'><span>"+escapeHtml(x.level+" · "+x.concept)+"</span><strong class='"+(x.correct?"sqlGood":"sqlBad")+"'>"+(x.correct?"Correct":"Incorrect")+"</strong></div>").join(""):"<p class='sqlIntro'>Your recent attempts will appear here.</p>";
}

function historyStorageKey(){return "sqlgram-practice-history-"+(localStorage.getItem("uid")||"guest");}
function loadLocalMetrics(){try{practiceMetrics=normalizeMetrics(JSON.parse(localStorage.getItem("sqlgram-metrics-"+(localStorage.getItem("uid")||"guest"))||"null"));}catch(e){practiceMetrics=emptyMetrics();}}

function localHistory(){
 try{return JSON.parse(localStorage.getItem(historyStorageKey())||"{}");}catch(e){return {};}
}
function persistLocalHistory(){
 const data={Easy:[...seenQuestionIds.Easy],Intermediate:[...seenQuestionIds.Intermediate],Hard:[...seenQuestionIds.Hard]};
 localStorage.setItem(historyStorageKey(),JSON.stringify(data));
 return data;
}
async function loadPracticeHistory(){
 const local=localHistory();
 loadLocalMetrics();
 for(const level of ["Easy","Intermediate","Hard"]){
  seenQuestionIds[level]=new Set(Array.isArray(local[level])?local[level]:[]);
 }
 try{
  const cloud=window.__sqlGramPracticeHistory?await window.__sqlGramPracticeHistory.load():{};
  for(const level of ["Easy","Intermediate","Hard"]){
   if(Array.isArray(cloud.seenByLevel?.[level])) for(const id of cloud.seenByLevel[level]) seenQuestionIds[level].add(id);
  }
  if(cloud.metrics)practiceMetrics=normalizeMetrics(cloud.metrics);
  historyReady=true;
  persistLocalHistory();
  localStorage.setItem("sqlgram-metrics-"+(localStorage.getItem("uid")||"guest"),JSON.stringify(practiceMetrics));
  if(window.__sqlGramPracticeHistory) await window.__sqlGramPracticeHistory.save(practicePayload());
  renderDashboard();
 }catch(e){
  console.warn("SqlGram cloud question history unavailable; using this device's history.",e);
  historyReady=true;
 }
}
function recordQuestion(level,id){
 seenQuestionIds[level].add(id);
 persistLocalHistory();
 const data=practicePayload();
 if(window.__sqlGramPracticeHistory){
  historySaveQueue=historySaveQueue.then(()=>window.__sqlGramPracticeHistory.save(data)).catch(e=>console.warn("Could not sync SQL question history to cloud.",e));
 }
}
function shuffle(items){
 const a=[...items];
 for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
 return a;
}
function nextChallenge(level){
 const concept=$("sqlConcept")?.value||"";
 const choices=challengePool.filter(c=>c.level===level&&(!concept||(conceptByQuestion[c.id]||"Other")===concept));
 if(!choices.length){$("sqlChallenge").textContent="No questions available for this concept and level.";return;}
 let deck=questionDecks[level].filter(c=>choices.some(x=>x.id===c.id));
 if(!deck.length){let unseen=choices.filter(c=>!seenQuestionIds[level].has(c.id));if(!unseen.length){seenQuestionIds[level].clear();unseen=choices;persistLocalHistory();}deck=shuffle(unseen);}
 const pick=deck.pop();questionDecks[level]=deck;lastQuestionByLevel[level]=pick.id;activeQuestionRecorded=false;activeChallenge=pick;expectedResult=db.exec(pick.solution);hintStep=0;$("sqlHintBox").hidden=true;
 const seen=seenQuestionIds[level].size;
 $("sqlChallenge").innerHTML="<strong>"+level+" · "+(conceptByQuestion[pick.id]||"SQL")+"</strong><p>"+escapeHtml(pick.prompt)+"</p>";
 $("sqlEditor").value="";$("sqlResults").innerHTML="<p class='sqlIntro'>Run a query to inspect the result.</p>";$("sqlStatus").className="sqlStatus";$("sqlStatus").textContent="Fresh question selected. Use progressive hints if needed.";updateStats();
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
  if(!activeQuestionRecorded&&activeChallenge){recordQuestion(activeChallenge.level,activeChallenge.id);activeQuestionRecorded=true;const total=challengePool.filter(c=>c.level===activeChallenge.level).length;$("sqlChallenge").querySelector("strong").textContent=activeChallenge.level+" challenge · "+seenQuestionIds[activeChallenge.level].size+" of "+total+" in this cycle";}
  const isCorrect=matchesExpected(result);
  if(isCorrect){completedCount++;if(timerHandle)timedScore++;setFeedback("correct","✓ CORRECT — Your output matches this challenge.");}
  else{setFeedback("incorrect","✕ INCORRECT — Query executed, but the output does not match the expected answer. Your results are shown below.");}
  if(activeChallenge)recordAttempt(activeChallenge,isCorrect);
  updateStats();
 }catch(e){setFeedback("error","⚠ QUERY FAILED — "+e.message);$("sqlResults").innerHTML="";}
}
function checkChallenge(){validateCurrentQuery();}
function updateStats(){$("sqlStats").textContent=completedCount+" correct answers · "+runs+" queries run · SQLite";renderDashboard();}
function renderResults(result){
 if(!result.length){$("sqlResults").innerHTML="<p class='sqlIntro'>Query executed successfully. No result set was returned.</p>";return;}
 $("sqlResults").innerHTML=result.map(r=>{const cols=r.columns||[];return "<table><thead><tr>"+cols.map(c=>"<th>"+escapeHtml(c)+"</th>").join("")+"</tr></thead><tbody>"+r.values.map(row=>"<tr>"+row.map(v=>"<td>"+escapeHtml(v)+"</td>").join("")+"</tr>").join("")+"</tbody></table>";}).join("");
}
function saveQuery(){
 const name=prompt("Name this query");if(!name)return;
 const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");
 const items=JSON.parse(localStorage.getItem(key)||"[]");items.unshift({name,sql:$("sqlEditor").value});localStorage.setItem(key,JSON.stringify(items.slice(0,30)));renderSaved();
}

function loadCustomQuestions(){
 try{const a=JSON.parse(localStorage.getItem("sqlgram-custom-questions")||"[]");a.forEach(q=>{if(q&&!challengePool.some(c=>c.id===q.id))challengePool.push(q);});$("sqlCustomCount").textContent=a.length+" custom questions on this device.";}catch(e){}
}
function addCustomQuestion(){
 const level=prompt("Difficulty: Easy, Intermediate or Hard","Intermediate");if(!["Easy","Intermediate","Hard"].includes(level))return;
 const promptText=prompt("Enter the learner question");if(!promptText)return;
 const solution=prompt("Enter reference SQL");if(!solution)return;
 try{db.exec(solution);}catch(e){alert("Invalid SQL: "+e.message);return;}
 const q={id:"custom-"+Date.now(),level,prompt:promptText,solution};challengePool.push(q);
 const a=JSON.parse(localStorage.getItem("sqlgram-custom-questions")||"[]");a.push(q);localStorage.setItem("sqlgram-custom-questions",JSON.stringify(a));
 $("sqlCustomCount").textContent=a.length+" custom questions on this device.";renderConceptOptions();alert("Question added.");
}
function exportQuestionBank(){
 const data=challengePool.map(q=>({id:q.id,level:q.level,prompt:q.prompt,solution:q.solution}));
 const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
 const a=document.createElement("a");a.href=url;a.download="sqlgram-question-bank.json";a.click();URL.revokeObjectURL(url);
}
function importQuestionBank(file){
 const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(reader.result);if(!Array.isArray(data))throw Error("Expected JSON array");
 const saved=JSON.parse(localStorage.getItem("sqlgram-custom-questions")||"[]");let count=0;
 data.forEach((q,i)=>{if(!["Easy","Intermediate","Hard"].includes(q.level)||!q.prompt||!q.solution)return;db.exec(q.solution);if(challengePool.some(c=>c.prompt===q.prompt))return;const item={id:"import-"+Date.now()+"-"+i,level:q.level,prompt:String(q.prompt),solution:String(q.solution)};challengePool.push(item);saved.push(item);count++;});
 localStorage.setItem("sqlgram-custom-questions",JSON.stringify(saved));$("sqlCustomCount").textContent=saved.length+" custom questions on this device.";renderConceptOptions();alert(count+" questions imported.");
 }catch(e){alert("Import failed: "+e.message);}};reader.readAsText(file);
}
function renderGamification(){
 const days=[...new Set(practiceMetrics.recent.map(x=>new Date(x.at).toDateString()))];let streak=0,d=new Date();
 while(days.includes(d.toDateString())){streak++;d.setDate(d.getDate()-1);}
 const best=Number(localStorage.getItem("sqlgram-best-score")||0);
 $("sqlGamification").innerHTML=[["Current streak",streak+" days"],["Best timed score",best+" correct"],["Practice days",days.length]].map(x=>"<div class='sqlMetric'><span>"+x[0]+"</span><strong>"+x[1]+"</strong></div>").join("");
}
function renderSaved(){const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");const items=JSON.parse(localStorage.getItem(key)||"[]");$("sqlSaved").innerHTML=items.length?items.map((x,i)=>"<button class='sqlAction' data-query='"+i+"'>"+escapeHtml(x.name)+"</button>").join(""):"<span class='sqlIntro'>Your saved queries will appear here.</span>";}
function openLab(){ const panel=$("sqlLab"); if(panel) panel.hidden=false; pendingOpen=true; closeDrawerSafe(); }
function closeDrawerSafe(){const d=$("drawer"),s=$("drawerShade"),m=$("menuBtn");if(d){d.classList.remove("open");d.setAttribute("aria-hidden","true");}if(s)s.hidden=true;if(m)m.setAttribute("aria-expanded","false");}
function init(){
 const panel=document.createElement("section");panel.id="sqlLab";panel.hidden=true;panel.innerHTML=`
 <div class="sqlTop"><h2>SQL Practice Lab</h2><button id="sqlClose">Close ✕</button></div>
 <p class="sqlIntro">Write and execute real SQLite queries in your browser. Your learning progress is saved on this device and synced when signed in.</p>
 <div class="sqlPanel sqlWide" id="sqlDashboard"><div class="sqlDashHead"><div><h3>Your learning progress</h3><p class="sqlIntro">A live view of your SQL practice.</p></div><button class="sqlAction" id="sqlDashRefresh">Refresh</button></div><div class="sqlMetricGrid" id="sqlMetricGrid"></div><div class="sqlLevelProgress" id="sqlLevelProgress"></div><div class="sqlDashBottom"><div><h4>Concepts to revisit</h4><div id="sqlWeakConcepts" class="sqlWeakList"></div></div><div><h4>Recent activity</h4><div id="sqlRecentActivity" class="sqlRecentList"></div></div></div></div>
 <div class="sqlGrid">
  <div class="sqlPanel"><h3>Practice controls</h3><label>Difficulty</label><select id="sqlLevel"><option>Easy</option><option>Intermediate</option><option>Hard</option></select><label>SQL concept</label><select id="sqlConcept"><option value="">All concepts</option></select><button class="sqlAction primary" id="sqlNext">Generate next question</button><div class="sqlPrompt" id="sqlChallenge"></div><div class="sqlToolbar"><button class="sqlAction" id="sqlHint">Get a hint</button><button class="sqlAction" id="sqlTimerStart">10-minute challenge</button><button class="sqlAction" id="sqlInterview">Interview mode</button></div><div id="sqlHintBox" class="sqlHintBox" hidden></div><div id="sqlTimer" class="sqlTimer">Timer not started</div><div class="sqlStats" id="sqlStats">Choose a level to begin · SQLite</div></div>
  <div class="sqlPanel"><h3>Database tables</h3><p class="sqlIntro"><strong>Core SQL practice schema</strong></p><p class="sqlIntro">employees (employee_id, first_name, last_name, email, job_title, manager_id, hire_date, salary, commission_pct, department_id)</p><p class="sqlIntro">departments (department_id, department_name, manager_id, location_id)</p><p class="sqlIntro">locations (location_id, city, state_province, country)</p><p class="sqlIntro">Relationships: employees.department_id → departments.department_id → locations.location_id</p><button class="sqlAction" id="sqlReset">Reset sample database</button></div>
  <div class="sqlPanel sqlWide"><h3>Your SQL query</h3><textarea id="sqlEditor" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea><div class="sqlToolbar"><button class="sqlAction primary" id="sqlRun">▶ Run query</button><button class="sqlAction" id="sqlSave">Save query</button><button class="sqlAction" id="sqlClear">Clear</button></div><p class="sqlStatus" id="sqlStatus" role="status"></p></div>
  <div class="sqlPanel sqlWide"><h3>Query results</h3><div class="sqlResults" id="sqlResults"><p class="sqlIntro">Run a query to see the output here.</p></div></div>
  <div class="sqlPanel sqlWide"><h3>My saved queries</h3><div class="sqlSaved" id="sqlSaved"></div></div><div class="sqlPanel sqlWide"><h3>Question bank tools</h3><p class="sqlIntro">Create personal questions or import/export a question pack. Custom questions are saved on this device.</p><div class="sqlToolbar"><button class="sqlAction" id="sqlAddQuestion">Add question</button><button class="sqlAction" id="sqlExportQuestions">Export bank</button><label class="sqlAction" for="sqlImportQuestions">Import bank</label><input id="sqlImportQuestions" type="file" accept="application/json" hidden></div><p id="sqlCustomCount" class="sqlIntro"></p></div><div class="sqlPanel sqlWide"><h3>Practice streak & personal best</h3><div id="sqlGamification" class="sqlMetricGrid"></div></div>
 </div>`;
 document.body.append(panel);
 if(pendingOpen) panel.hidden=false;
 const level=$("sqlLevel");loadCustomQuestions();renderConceptOptions();$("sqlAddQuestion").onclick=addCustomQuestion;$("sqlExportQuestions").onclick=exportQuestionBank;$("sqlImportQuestions").onchange=e=>{if(e.target.files[0])importQuestionBank(e.target.files[0]);e.target.value="";};$("sqlDashRefresh").onclick=renderDashboard;$("sqlNext").onclick=()=>nextChallenge(level.value);level.onchange=()=>nextChallenge(level.value);$("sqlConcept").onchange=()=>nextChallenge(level.value);$("sqlHint").onclick=showHint;$("sqlTimerStart").onclick=()=>startSqlTimer(10,"Timed challenge");$("sqlInterview").onclick=()=>{level.value="Hard";$("sqlConcept").value="";nextChallenge("Hard");startSqlTimer(20,"Interview simulation");};
 $("sqlClose").onclick=()=>panel.hidden=true;
 $("sqlRun").onclick=validateCurrentQuery;
 $("sqlClear").onclick=()=>{$("sqlEditor").value="";$("sqlStatus").textContent="Editor cleared.";};
 $("sqlSave").onclick=saveQuery;
 $("sqlReset").onclick=()=>{setupDb();questionDecks.Easy=[];questionDecks.Intermediate=[];questionDecks.Hard=[];nextChallenge(level.value);$("sqlStatus").textContent="Employee, department and location sample data reset.";};
 $("sqlSaved").onclick=e=>{const b=e.target.closest("[data-query]");if(!b)return;const key="sqlgram-queries-"+(localStorage.getItem("uid")||"guest");const items=JSON.parse(localStorage.getItem(key)||"[]");$("sqlEditor").value=items[Number(b.dataset.query)]?.sql||"";};
 setupDb();loadPracticeHistory().then(()=>nextChallenge("Easy"));renderSaved();renderDashboard();
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
