module.exports = async (message, args, config) => {
    // faces 
    var faces = ["(・`ω´・)", ";;w;;", "owo", "UwU", ">w<", "^w^",
        "OwO", "Owo", "owO", "ÓwÓ", "ÕwÕ",
        "@w@", "ØwØ", "øwø", "uwu", "☆w☆",
        "✧w✧", "♥w♥", "゜w゜", "◕w◕", "ᅌwᅌ",
        "◔w◔", "ʘwʘ", "⓪w⓪", "︠ʘw ︠ʘ", "(owo)",
        "𝕠𝕨𝕠", "𝕆𝕨𝕆", "𝔬𝔴𝔬", "𝖔𝖜𝖔", "𝓞𝔀𝓞",
        "𝒪𝓌𝒪", "𝐨𝐰𝐨", "𝐎𝐰𝐎", "𝘰𝘸𝘰", "𝙤𝙬𝙤",
        "𝙊𝙬𝙊", "𝚘𝚠𝚘", "σωσ", "OɯO", "oʍo",
        "oᗯo", "๏w๏", "o̲wo̲", "ᎧᏇᎧ", "օաօ",
        "(。O ω O。)", "(O ᵕ O)", "(O꒳O)", "ღ(O꒳Oღ)", "♥(。ᅌ ω ᅌ。)",
        "(ʘωʘ)", "( °꒳° )", "( °ᵕ° )", "( °ω° )", "（ ゜ω 。）"];
    function owoify(text) {
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
        return text;
    };
    text = args.join(" ");
    face = faces[Math.floor(Math.random() * faces.length)];
    message.channel.send({
        embed: {
            description: text,
            title: face
        },
    })
}