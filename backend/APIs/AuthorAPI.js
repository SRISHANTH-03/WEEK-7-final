import exp from 'express'
import { UserModel } from '../models/UserModel.js'
import {ArticleModel} from '../models/articleModel.js'
import { verifyToken } from '../middlewares/verifyToken.js'
export const authorApp=exp.Router()

// Write article
authorApp.post("/article",verifyToken('AUTHOR'),async(req,res)=>{
    // get article from client
    const articleObj=req.body
    // check author
    let author=await UserModel.findById(articleObj.author)
    if(!author){
        return res.status(404).json({message:"Invaild author"})
    }

    if(author.email!== req.user.email){
        return res.status(403).json({message:"Your unauthorized"})
    }
    
    // publish the article
    // create new article
    const newArticle=new ArticleModel(articleObj)
    // save article
    await newArticle.save()
    return res.status(201).json({message:"Article published successfully"})
})

// Read own article
authorApp.get('/articles',verifyToken('AUTHOR'),async(req,res)=>{
        const authorIdOfToken=req.user?.id
        const articleObj=await ArticleModel.find({author:authorIdOfToken})
    
        res.status(200).json({message:"Articles",payload:articleObj})
})


// Edit article
authorApp.put('/articles',verifyToken('AUTHOR'),async(req,res)=>{
    const authorIdOfToken=req.user?.id
    const {articleID,title,category,content}=req.body
    let updatedArticleObj=await ArticleModel.findOneAndUpdate({_id:articleID,author:authorIdOfToken},{$set:{title,category,content}},{new:true})
    if(!updatedArticleObj){
        return res.status(403).json({message:"Not authorized to edit the article"})
    }
    res.status(200).json({message:"Article modified successfully",payload:updatedArticleObj})
})


// Soft delete
authorApp.patch("/articles",verifyToken("AUTHOR"),async(req,res)=>{
    try{
        const authorIdOfToken=req.user?.id
        const {articleId,isArticleActive}=req.body
        let updatedArticleObj=await ArticleModel.findOne({_id:articleId,author:authorIdOfToken})
        // article not found
      if (!updatedArticleObj) {
        return res.status(404).json({
          message: "Article not found",
        });
      }

        if(isArticleActive===updatedArticleObj.isArticleActive){
            return res.status(200).json({message:"Article already in the same state"})
        }
        updatedArticleObj.isArticleActive=isArticleActive
        await updatedArticleObj.save()
        res.status(200).json({message:"Article",payload:updatedArticleObj})

    } catch (error) {
        console.log(error);
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
})