let Assignment = require('../model/assignment');


// Récupérer tous les assignments (GET)
function getAssignments(req, res) {
    const page = parseInt(req.query.page) || 1; // 默认第1页
    const limit = parseInt(req.query.limit) || 10; // 默认每页10条记录

    const aggregateQuery = Assignment.aggregate(); // 创建聚合查询

    Assignment.aggregatePaginate(aggregateQuery, { page, limit }, (err, result) => {
        if (err) {
            console.error("分页查询错误:", err);
            return res.status(500).send(err);
        }
        res.json(result); // 返回分页结果
    });
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE reçu assignment : ");
    console.log(req.body);

    // 使用 id 而不是 _id
    Assignment.findOneAndUpdate(
        { id: req.params.id }, // 条件基于自定义 id
        req.body, // 更新的数据
        { new: true }, // 返回更新后的文档
        (err, assignment) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            if (!assignment) {
                console.log(`Assignment with id ${req.params.id} not found.`);
                return res.status(404).json({ message: `Assignment with id ${req.params.id} not found.` });
            }
            res.json({ message: `${assignment.nom} updated` });
        }
    );
}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
    const id = req.params.id;

    // 根据自定义的 id 字段删除
    Assignment.findOneAndRemove({ id: id }, (err, assignment) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (!assignment) {
            return res.status(404).json({ message: `Assignment with id ${id} not found.` });
        }
        res.json({ message: `${assignment.nom} deleted` });
    });
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
