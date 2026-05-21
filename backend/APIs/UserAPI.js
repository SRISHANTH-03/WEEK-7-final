import exp from 'express'
import { verifyToken } from '../middlewares/verifyToken.js'
import { ArticleModel } from '../models/articleModel.js'
export const userApp=exp.Router()

// Read articles of all authors
userApp.get("/articles",verifyToken("USER"),async(req,res)=>{
    // read articles
    const articlesList=await ArticleModel.find({isArticleActive:true})
    res.status(200).json({message:"Articles",payload:articlesList})

})

// Add comment to an article
userApp.put("/articles",verifyToken("USER"),async(req,res)=>{
    // get body from the req
    const {articleId,comment}=req.body
    // check article 
    const articleDocument=await ArticleModel.findOne({_id:articleId,isArticleActive:true})
    // if article not fount
    if(!articleDocument){
        return res.status(404).json({message:"Article not found"})
    }
    // get user id
    const userId=req.user?.id
    //  add comment to comments array of articleDocument
    articleDocument.comment.push({user:userId,comment:comment})
    await articleDocument.save()
    res.status(200).json({message:"Comment added successfully",payload:articleDocument})
})

// Get single article by ID
userApp.get("/article/:id", verifyToken("USER", "AUTHOR"), async (req, res) => {
  try {
    const article = await ArticleModel.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article", payload: article });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});