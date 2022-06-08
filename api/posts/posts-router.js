// implement your posts router here

const express = require('express')
const postsModel = require('./posts-model.js')
const router = express.Router()
const cors = require('cors')

router.use(express.json())
router.use(cors())

/*
  find,
  findById,
  insert,
  update,
  remove,
  findPostComments,
  findCommentById,
  insertComment,
*/

// 1 | GET| /api/posts| Returns **an array of all the post objects** contained in the database                                                          |
router.get('/', (req, res)=>{
    postsModel.find()
        .then(result=>{
            res.json(result)
        })
        .catch(error=>{
            res.status(500).json({ message: "The posts information could not be retrieved" })
        })
})
//| 2 | GET| /api/posts/:id| Returns **the post object with the specified id**                                                                               |
router.get('/:id', (req,res)=>{
    postsModel.findById(req.params.id)
        .then(result=>{
            result ? res.json(result) : res.status(404).json({ message: "The post with the specified ID does not exist" })
        })
        .catch(error=>{
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})
//| 3 | POST| /api/posts| Creates a post using the information sent inside the request body and returns **the newly created post object**                 |
router.post('/', (req, res)=>{
    if(req.body.title == undefined || req.body.contents == undefined){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        postsModel.insert(req.body)
            .then(result=>{
                const {title, contents} = req.body
                res.status(201).json({id: result, title: title, contents: contents})
            })
            .catch(error=>{
                res.status(500).json({ message: "There was an error while saving the post to the database" })
            })
        }
})
//| 4 | PUT| /api/posts/:id| Updates the post with the specified id using data from the request body and **returns the modified document**, not the original |
router.put('/:id',(req,res)=>{
    if(!req.body.title || !req.body.contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        postsModel.update(req.params.id, req.body)
        .then(result=>{
            !result ? res.status(404).json({ message: "The post with the specified ID does not exist" }): res.json({...req.body, id:result})   
        })
        .catch(error=>{
            res.status(500).json({ message: "The post information could not be modified" })
        })
    }
})

//| 5 | DELETE | /api/posts/:id| Removes the post with the specified id and returns the **deleted post object**                                                  |
router.delete('/:id', (req,res)=>{
    postsModel.findById(req.params.id)
    .then(resultFind=>{
        if(resultFind){
            postsModel.remove(req.params.id)
                .then(result=>{
                    result ? res.json(resultFind) : res.status(404).json({ message: "The post with the specified ID does not exist" })
                })
                .catch(error=>{
                    res.status(500).json({ message: "The post could not be removed" })
                })
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    })
    .catch(error=>{
        res.status(500).json({ message: "The post information could not be retrieved" })
    })
})

//| 6 | GET| /api/posts/:id/comments | Returns an **array of all the comment objects** associated with the post with the specified id      
router.get('/:id/comments', (req,res)=>{
    postsModel.findPostComments(req.params.id)
        .then(result=>{
           result.length > 0 ? res.json(result) : res.status(404).json({ message: "The post with the specified ID does not exist" })
        })
        .catch(error=>{
            res.status(500).json({ message: "The post information could not be retrieved" })
        })
})


module.exports= router