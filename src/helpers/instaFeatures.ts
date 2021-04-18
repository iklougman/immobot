const emojis = ["\u{1F3E0}", "\u{1F3E1}", "\u{1F3E2}", "\u{1F306}", "\u{1F303}"]

export const randomizeEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

export const generateHashTags = (priceNum: number) => {
    if (priceNum <= 200000) { return '#bis200Tausend' } else
        if (priceNum <= 300000) { return '#bis300Tausend' } else
            if (priceNum <= 400000) { return '#bis400Tausend' } else
                if (priceNum <= 500000) { return '#bis500Tausend' } else
                    if (priceNum <= 600000) { return '#bis600Tausend' } else
                        if (priceNum < 700000) { return '#bis700Tausend' } else {
                            return '#ueber700Tausend'
                        }
};


