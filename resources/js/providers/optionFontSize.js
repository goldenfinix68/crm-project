const optionFontSize = () => {
    let options = [];

    for (let x = 10; x <= 60; x++) {
        options.push({
            label: `${x}px`,
            value: x,
        });
    }

    return options;
};

export default optionFontSize;
