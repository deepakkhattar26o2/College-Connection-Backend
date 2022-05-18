import {Request, Response} from 'express'
import Blog from "../models/Blog";
import User from "../models/User";
import Comment from "../models/Comment";

interface blogRequestBody {
    author_id : string,
    title : string,
    content : string,
    // sub_title : string
}
const createBlog =  (req : Request, res : Response)=>{
    const body : blogRequestBody = req.body
    User.findById(body.author_id).exec().then(
        doc=>{
            if(!doc){
                return res.status(409).json({message : "Invalid Request!"})
            }
            const newBlog = new Blog({
                author_id : body.author_id, 
                title : body.title,
                content : body.content,
                // sub_title : body.sub_title
            })
            newBlog.save().then(
                (conc : any)=>{
                    return res.status(200).json(conc)
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
    Blog.findById(req.params.id).exec().then(
        (doc : any)=>{
            if(!doc){
                return res.status(404).json({message: 'Blog Not Found!'})
            }
            Comment.find({blog_id : req.params.id}).exec().then(
                (docs : any)=>{
                    const mdocs = docs
                    let marr : string[] = []
                    for(let i=0; i<mdocs.length; i++) {
                        User.findById(mdocs[i].user_id).select("userName").exec().then(
                            (usero: any)=>
                            {
                               marr.push(usero.userName)
                            }
                        ).catch(
                            (err : Error)=>{
                                return res.status(500).json({message : err.message})
                            }
                        )
                    }
                    User.findById(doc.author_id).select("_id userName").exec().then(
                        (author: any)=>{
                            return res.status(200).json({blog : doc,author_details: author, 
                                comments : mdocs||null, commentors: marr || null
                            })
                        }
                    ).catch(
                        (err : Error)=>{
                            return res.status(500).json({message : err.message})
                        }
                    )
                }
            ).catch(
                (err : Error)=>{
                    res.status(500).json({message : err.message})
                }
            )
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
            res.status(200).json(docs.reverse())
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
            res.status(200).json(doc)
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const deleteBlog =  (req : Request, res : Response)=>{
    Blog.findByIdAndDelete(req.params.id).exec().then(
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

interface commentBody{
    blog_id : string,
    user_id : string,
    content : string
}
const createComment = (req : Request, res : Response)=>{
    const body : commentBody = req.body;
    Blog.findById(body.blog_id).exec().then(
        (doc : any)=>{
            if(!doc){
                return res.status(409).json({message : "Blog doesn't exist anymore!"})
            }
            let comment = new Comment({
                blog_id : body.blog_id,
                user_id : body.user_id,
                content : body.content,
            })
            comment.save().then(
                (conc : any)=>{
                    return res.status(200).json({message : "Commented Successfully!"})
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
interface deleteCommentBody{
    comment_id : string,
    user_id : string//the one who wants to delete comment, allowed only for the one who commented,as of now
}
const deleteComment = (req : Request, res : Response)=>{
    const body : deleteCommentBody = req.body;
    Comment.findById(body.comment_id).exec().then(
        doc=>{
            if(!doc || doc.user_id!=body.user_id){
                return res.status(409).json({message : "Cannot Delete Comment"})
            }
            Comment.findByIdAndDelete(body.comment_id).exec().then(
                (conc : any)=>{
                    res.status(200).json({message : "Comment Deleted Successfully!"})
                }
            ).catch(
                (err : Error)=>{
                    return res.status(409).json({message : err.message})
                }
            )
        }
    ).catch(
        (err : Error)=>{res.status(500).json({message : err.message})}
    )
}

const likeBlog = (req : Request, res : Response)=>{
    const body : any = req.body
    Blog.findById(body.blog_id).exec().then(
        (doc : any)=>{
            if(!doc){
                res.status(409).json({message : "Not Found!"})
            }
            Blog.updateOne({_id : body.blog_id}, {$set : {likes : doc.likes+1}}).exec().then(
                conc=>{
                    res.status(200).json({message : "Like Successful"})
                }
            ).catch(
                (err : Error)=>{
                    return res.status(500).json({message : err.message})
                }
            )
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const unlikeBlog = (req : Request, res : Response)=>{
    const body : any = req.body
    Blog.findById(body.blog_id).exec().then(
        (doc : any)=>{
            if(!doc){
                res.status(409).json({message : "Not Found!"})
            }
            Blog.updateOne({_id : body.blog_id}, {$set : {likes : doc.likes-1}}).exec().then(
                conc=>{
                    res.status(200).json({message : "Like Successful"})
                }
            ).catch(
                (err : Error)=>{
                    return res.status(500).json({message : err.message})
                }
            )
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

const getAllBlogs = (req : Request, res : Response) => {
    Blog.find().exec().then(
        (docs : any)=>{
            if(docs.length===0){
                return res.status(409).json({message : 'No Blogs Found'})
            }
            res.status(200).json(docs.reverse())
        }
    ).catch(
        (err : Error)=>{
            res.status(500).json({message : err.message})
        }
    )
}

export {createBlog, getBlogById, getAllBlogsByAuthor, searchBlogByTitle, updateBlog, deleteBlog, createComment, deleteComment, likeBlog, unlikeBlog, getAllBlogs}