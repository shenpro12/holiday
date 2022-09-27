module.exports = {
    checkHex: function(str) {
        let HexCharacter = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'A', 'B', 'C', 'D', 'E', 'F']
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < HexCharacter.length; j++) {
                if (str[i] == HexCharacter[j]) {
                    break
                }
                if (j == HexCharacter.length - 1) {
                    return true
                }
            }
        }
        return false
    }
}