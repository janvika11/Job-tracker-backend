const express =require("express");
const cors =require("cors");
const dotenv =require("dotenv");
const {pool} = require("./postgres.js");


dotenv.config();
const app=express();
const PORT=process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Root route
app.get('/',(req,res)=>{
    res.send('API running');
});



//create jobs
app.post("/jobs",async(req,res)=>{
    try{
    const {company,role,status,note}=req.body;
    const result=await pool.query(
        "Insert into jobs (company,role,status,note) VALUES ($1,$2,$3,$4) RETURNING*",
        [company,role,status,note]);
        res.json(result.rows[0]);
    } catch(err){
            res.status(500).json({error:err.message});
        }
    });
    app.get("/jobs",async(req,res)=>{
        try{
           const result = await pool.query("SELECT id, company, role, status, applied_date, note FROM jobs ORDER BY id ASC");
        res.json(result.rows);
        }
        catch(err){
            res.status(500).json({error:err.message});
        }
    });
    app.put("/jobs/:id",async(req,res)=>{
        try{
     const {id}=req.params;
     const {company,role,status,note}=req.body;
     const result=await pool.query(
        "Update jobs SET company=$1,role=$2,status=$3,note=$4 WHERE id=$5 RETURNING*",
        [company,role,status,note,id]
     
     );
     res.json(result.rows[0]);
    }
    catch(err){
            res.status(500).json({error:err.message});
        }
    }
    )
    //delete job
    app.delete("/jobs/:id",async(req,res)=>{
        try{
        const{id}=req.params;
        await pool.query("DELETE FROM jobs WHERE id=$1",[id]);
        res.sendStatus(204);
        }
        catch(err){
            res.status(500).json({error:err.message});
        }
    });

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});