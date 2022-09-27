const rep_comments = require('../models/rep_comment')
const account = require('../models/account')
module.exports = {
    getComment: async function(commentsData, userid) {
        let comment = []
        for (let i = 0; i < commentsData.length; i++) {
            let rep_comment = []
            let user = await account.findOne({ _id: commentsData[i].userid })
            let rep_commentsData = await rep_comments.find({ pertain: commentsData[i]._id })
            for (let i = 0; i < rep_commentsData.length; i++) {
                let selft = false
                if (userid == rep_commentsData[i].userid) {
                    selft = true
                }
                let user = await account.findOne({ _id: rep_commentsData[i].userid })
                rep_comment.push({
                    id: rep_commentsData[i]._id,
                    userid: rep_commentsData[i].userid,
                    content: rep_commentsData[i].content,
                    pertain: rep_commentsData[i].pertain,
                    time: rep_commentsData[i].time,
                    selft,
                    username: user.username
                })

            }

            let selft = false
            if (userid == commentsData[i].userid) {
                selft = true
            }
            comment.push({
                id: commentsData[i]._id,
                userid: commentsData[i].userid,
                content: commentsData[i].content,
                pertain: commentsData[i].pertain,
                time: commentsData[i].time,
                rep_comments: rep_comment,
                selft,
                username: user.username
            })
        }
        return comment
    }
}