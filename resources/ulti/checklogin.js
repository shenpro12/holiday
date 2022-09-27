module.exports = {
    checkLogin: function(session) {
        if (session.userid) {
            return {
                status: true,
                userid: session.userid,
                username: session.username,
                admin: session.admin
            }
        } else {
            return false
        }
    }
}