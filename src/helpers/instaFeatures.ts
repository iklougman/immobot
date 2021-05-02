const emojis = ["\u{1F3E0}", "\u{1F3E1}", "\u{1F3E2}", "\u{1F306}", "\u{1F303}", "\u{1F4A5}", "\u{1F496}",
    "\u{1F4AC}", "\u{1F44F}", "\u{1F3DB}", "\u{1F3D8}", "\u{1F3F0}", "\u{2709}", "\u{1F4CC}"]

export const randomizeEmoji = () => emojis[Math.floor(Math.random() * emojis.length)];

export const generateHashTags = (priceNum: number) => {
    if (priceNum <= 500) { return '#bis500€' } else
        if (priceNum <= 700) { return '#bis700€' } else
            if (priceNum <= 900) { return '#bis900€' } else
                if (priceNum <= 1000) { return '#bis1000€' } else
                    if (priceNum <= 1200) { return '#bis1200€' } else
                        if (priceNum <= 1500) { return '#bis1500€' } else
                            if (priceNum <= 2000) { return '#bis2000€' } else
                                if (priceNum <= 200000) { return '#bis200Tausend' } else
                                    if (priceNum <= 300000) { return '#bis300Tausend' } else
                                        if (priceNum <= 400000) { return '#bis400Tausend' } else
                                            if (priceNum <= 500000) { return '#bis500Tausend' } else
                                                if (priceNum <= 600000) { return '#bis600Tausend' } else
                                                    if (priceNum < 700000) { return '#bis700Tausend' } else {
                                                        return '#ueber700Tausend'
                                                    }
};


