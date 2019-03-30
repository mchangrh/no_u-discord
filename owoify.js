module.exports = async (message, args, config) => {
    function owo(text) {
        // faces 
        var faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^"];
        // replace with r or l with w
        text = text.replace(/(?:r|l)/g, "w");
        text = text.replace(/(?:R|L)/g, "W");
        // n[aeiou] with ny[aeiou]
        text = text.replace(/n([aeiou])/g, 'ny$1');
        text = text.replace(/N([aeiou])/g, 'Ny$1');
        text = text.replace(/N([AEIOU])/g, 'Ny$1');
        // ove with uv
        text = text.replace(/ove/g, "uv");
        // replace ! with faces
        text = text.replace(/\!+/g, " " + faces[Math.floor(Math.random() * faces.length)] + " ");
        // finally return
        return text
    };
}