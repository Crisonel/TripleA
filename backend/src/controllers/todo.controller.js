import { User } from "../models/user.models.js";
import { Todo } from "../models/todo.models.js";

const createTodo = async (req,res) => {
    try {
        const user = await User.findById(req.user?._id);
        const {title, description, content, priority, tags} = req.body;
        if(!title){
            console.log("Title is required");
            return res.status(401);
        }

        const todo = await Todo.create({
            title,
            description: (description? description:null),
            content: (content? content: null),
            priority: (priority? priority: null),
            tags: (tags? tags:""),
            user: user._id
        });

        if(!todo){
            console.log("Task can not be created");
            return res.status(400);
        }

        console.log("Task created successfully");
        return res.status(200).json({todo});


    } catch (error) {
        console.log("Task can not be created.", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const loadTodos = async(req,res) => {
    try {
        const user = await User.findById(req.user?._id);
        if(!user){
            console.log("Unauthorized access");
            return res.status(400).json({message: "Invalid Access Token"});
        }

        const todos = await Todo.find({user: user._id});

        return res.status(200).json({
            todos
        });
    } catch (error) {
        console.log("Could not get todos");
        return res.status(500).json({ message: "Could not get todos"});
    }
}



const updateTodo = async (req,res) => {
    const user = await User.findById(req.user?._id);
    const { 
        title = '', 
        description = '', 
        content = '', 
        priority = '', 
        tags = [] ,
        deadline
    } = req.body; 
    const _id = req.params.id;
    const task = await Todo.findById(_id);
    await Todo.findOneAndUpdate(
        {$and: [{_id},{user: user._id}]},
        {
            $set: {
            title: (task.title !== title?.trim())? title.trim(): task.title,
            description: (task.description !== description.trim())? description.trim(): task.description,
            content: (task.content !== content.trim())? content.trim(): task.content,
            priority: (task.priority !== priority.trim().toLowerCase())? priority.trim().toLowerCase(): task.priority,
            tags: (JSON.stringify(task.tags) !== JSON.stringify(tags))? tags: task.tags,
            deadline: (task.deadline?.getTime() !== deadline?.getTime())? deadline: task.deadline
            }
        },
        {new: true}
    );

    const newTask = await task.save({validateBeforeSave: false});

    console.log("Task updated");
    return res.status(200).json({
        newTask
    });
}

const deleteTodo = async(req,res) => {
    const user = await User.findById(req.user?._id);
    const taskId = req.params.id;
    await Todo.findOneAndDelete({
        $and:[
            {_id: taskId},
            {user: user._id}
        ]
});
return res.status(200).json({message: "Deleted successfully"});
}

export { createTodo, updateTodo, deleteTodo, loadTodos };