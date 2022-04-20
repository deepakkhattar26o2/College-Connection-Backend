import {Request, Response} from 'express'
import Blog from "../models/Blog";
import User from "../models/User";

interface blogRequestBody {
    author_id : number,
    title : string,
    content : string
}
const createBlog =  (req : Request, res : Response)=>{
    const body : blogRequestBody = req.body
    User.findOne({_id : body.author_id}).exec().then(
        doc=>{
            if(!doc){
                return res.status(409).json({message : "Invalid Request!"})
            }
            const newBlog = new Blog({
                author_id : body.author_id, 
                title : body.title,
                content : body.content,
            })
            newBlog.save().then(
                (conc : any)=>{
                    return res.status(200).json({message : 'Blog Created Successfully'})
                }
            ).catch(
                (err : Error)=>{
                    return res.status(500).json({message : err.message})
                }
            )
        }
    ).catch(
        (err : Error)=>{res.status(500).json({message : err.message})}
    )
}

const getBlogById = (req : Request, res : Response)=>{
    Blog.findOne({_id : req.params.id}).exec().then(
        (doc : any)=>{
            if(!doc){
                return res.status(404).json({message: 'Blog Not Found!'})
            }
            return res.status(200).json({blog : doc})
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message: err.message})
        }
    )
}

const getAllBlogsByAuthor = (req : Request, res : Response)=>{
    Blog.find({author_id : req.params.id}).exec().then(
        (docs : any)=>{
            if(docs.length===0){
                return res.status(409).json({message : 'No Blogs Found'})
            }
            res.status(200).json(docs)
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const searchBlogByTitle =  (req : Request, res : Response)=>{
    Blog.find({title: new RegExp(req.params.title, '')}).exec().then(
        (docs : any)=>{
            if(docs.length===0){
                return res.status(409).json([])
            }
            return res.status(200).json(docs)
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const updateBlog = (req : Request, res : Response)=>{
    if(req.body.author_id){
        return res.status(403).json({message : "BEGONE!"})
    }
    Blog.findOneAndUpdate({_id: req.params.id}, {$set: req.body}).exec().then(
        (doc : any)=>{
            if(!doc){
                return res.status(409).json({message : 'Invalid Request!'})
              }
            res.status(200).json({message : 'Blog Updated Successfully', baady : doc})
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const deleteBlog =  (req : Request, res : Response)=>{
    Blog.findOneAndDelete({_id: req.params.id}).exec().then(
        (doc : any)=>{
            if(!doc){
                return res.status(409).json({message : 'Invalid Request'})
            }
            res.status(200).json({message : "Blog Deleted Successfully"})
        }
    ).catch(
        (err : Error)=>res.status(500).json({message : err.message})
    )
}

export {createBlog, getBlogById, getAllBlogsByAuthor, searchBlogByTitle, updateBlog, deleteBlog}