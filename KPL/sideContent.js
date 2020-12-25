function drawSideContent(div, side, data, cScale, heroTable) {
    let sideHeight = div._groups[0][0].clientHeight,
        sideRemindW = 30,
        sideRemind = div.append('div').style('width', sideRemindW + 'px').style('height', sideHeight + 'px').style('background-color', cScale[side] + '7f'),
        invadeBlock = div.append('div').attr('class', 'rowFlex'),
        invadeHeroBlock = div.append('div').attr('class', 'colFlex'),
        oppoRemind = div.append('div').style('width', sideRemindW / 2 + 'px').style('height', sideHeight + 'px'),
        invadeHeroOppoBlock = div.append('div').attr('class', 'colFlex').style('border', "1px grey groove").style('margin-left', '2px'),
        firstTrend = div.append('div').attr('class', 'rowFlex').style('margin-left', '5px'),
        firstTower = div.append('div').attr('class', 'rowFlex').style('margin-left', '5px').style('margin-right', '5px').style('background-color', "#cccccc5f"),
        sourceControl = div.append('div').attr('class', 'colFlex').style('margin-left', '0px');

    let invadeColor = {
        // '0': '#f4efd3', // 和平开局
        '0': '#99c1b9',
        '1': '#f2d0a9', // 被入侵
        '2': '#d88c9a', // 入侵
        // '3': '#c2b0c9' //互换
        '3': '#8e7dbe'
    }

    sideRemind.append('svg')
        .style('width', sideRemindW).style('height', sideHeight)
        .append('text').text(side + ' side')
        .attr('transform', 'translate(' + sideRemindW / 1.5 + ',' + sideHeight / 2 + '),rotate(-90)')
        .style('text-anchor', 'middle')
        .style('font-size', sideRemindW / 1.5);

    oppoRemind.append('svg')
        .style('width', sideRemindW / 2).style('height', sideHeight)
        .append('text').text('敌方在各情况下的常用英雄')
        .attr('transform', 'translate(' + sideRemindW / 2.5 + ',' + sideHeight / 2 + '),rotate(-90)')
        .style('text-anchor', 'middle')
        .attr('class', 'content_text');

    drawInvadePie(invadeBlock, data['invade'][side], sideHeight, invadeColor)
    drawInvadeHero(invadeHeroBlock, data['invadeHero'][side], 'self', sideHeight, invadeColor, heroTable)
    drawInvadeHero(invadeHeroOppoBlock, data['invadeHero'][side], 'oppo', sideHeight, invadeColor, heroTable)
    drawFirstControl(firstTrend, data['firstControl'][side], sideHeight, cScale)
    drawFirstTower(firstTower, data['firstTower'][side], sideHeight, cScale)
    drawSourceControl(sourceControl, data['sourceControl'][side], sideHeight, cScale)
}

function drawSourceControl(div, data, maxH, cScale) {
    let blockW = 150,
        blockH = maxH * 0.8,
        stormPart = div.append('div').style('width', blockW + 'px').style('height', blockH / 3 + 'px').attr('class', 'colFlex ratioBox'),
        bigPart = div.append('div').style('width', blockW + 'px').style('height', blockH / 3 + 'px').attr('class', 'rowFlex'),
        bTyrantPart = bigPart.append('div').style('width', blockW / 2 + 'px').style('height', blockH / 3 + 'px').attr('class', 'colFlex ratioBox'),
        bDominatePart = bigPart.append('div').style('width', blockW / 2 + 'px').style('height', blockH / 3 + 'px').attr('class', 'colFlex ratioBox'),
        smallPart = div.append('div').style('width', blockW + 'px').style('height', blockH / 3 + 'px').attr('class', 'rowFlex'),
        sTyrantPart = smallPart.append('div').style('width', blockW / 2 + 'px').style('height', blockH / 3 + 'px').attr('class', 'colFlex ratioBox'),
        sDominatePart = smallPart.append('div').style('width', blockW / 2 + 'px').style('height', blockH / 3 + 'px').attr('class', 'colFlex ratioBox');

    let appendOrder = [
        [sTyrantPart, 1, '暴君'],
        [bTyrantPart, 1, '黑暗暴君'],
        [stormPart, 2, '风暴龙王'],
        [bDominatePart, 1, '主宰'],
        [sDominatePart, 1, '先知主宰']
    ];

    for (let i in appendOrder) {
        appendRect(appendOrder[i], blockW / 2, blockH / 3, cScale, data['ratio'][i])
    }
}

function appendRect(divArr, width, height, cScale, data) {
    let svg = divArr[0].append('svg').attr('width', divArr[1] * width).attr('height', height),
        rectW = d3.max([data * divArr[1] * width, 0]),
        rectH = d3.max([data * height, 0])


    svg.append('rect')
        .attr('width', rectW)
        .attr('height', rectH)
        .attr('transform', 'translate(' + (width * divArr[1] - rectW) / 2 + ',' + (height - rectH) / 2 + ')')
        .style('fill', function() {
            if (data > 0.5) {
                return cScale['more']
            } else if (data >= 0) {
                return cScale['less']
            } else {
                return 'grey'
            }
        })
        .style('opacity', function() {
            if (data > 0.5) {
                return data
            } else {
                return 1 - data
            }
        })

    svg.append('text').text(divArr[2] + '控制率').attr('class', 'label_text').attr('transform', 'translate(' + (width * divArr[1]) / 2 + ',' + height * 0.8 + ')')
        .style('text-anchor', 'middle')
    if (data >= 0) {
        svg.append('text').text((data * 100).toFixed(1) + '%').attr('class', 'label_text').attr('transform', 'translate(' + (width * divArr[1]) / 2 + ',' + height * 0.5 + ')')
            .style('text-anchor', 'middle')
    } else {
        svg.append('text').text('无击杀数据').attr('class', 'label_text').attr('transform', 'translate(' + (width * divArr[1]) / 2 + ',' + height * 0.5 + ')')
            .style('text-anchor', 'middle')
    }

}

function drawFirstTower(div, data, maxH, cScale) {
    let blockW = 40,
        blockH = maxH * 0.8,
        textOrder = ['一塔', '二塔', '高地'];
    let circleChart = div.append('div').style('width', blockW + 'px').style('height', blockH + 'px').attr('class', 'colFlex'),
        textPart = div.append('div').style('width', blockW + 'px').style('height', blockH + 'px').attr('class', 'colFlex');

    for (let i = 0; i < textOrder.length; i++) {
        let circle = circleChart.append('svg').attr('width', blockW).attr('height', blockH),
            textBox = textPart.append('div').style('width', blockW + 'px').style('height', blockH / textOrder.length + 'px').attr('class', 'colFlex').style('justify-content', 'center')
        radius = d3.min([blockW / 2, blockH / textOrder.length / 2]);

        circle.append('circle')
            .attr('r', radius)
            .attr('cx', blockW / 2)
            .attr('cy', blockH / textOrder.length / 2)
            .style('fill', function() {
                if (data[textOrder.length - 1 - i] > 0.5) {
                    return cScale['more']
                } else {
                    return cScale['less']
                }
            })
            .style('opacity', function() {
                if (data[textOrder.length - 1 - i] > 0.5) {
                    return data[textOrder.length - 1 - i]
                } else {
                    return 1 - data[textOrder.length - 1 - i]
                }
            })

        circle.append('text').style('text-anchor', 'middle')
            .text(function() {
                return (data[textOrder.length - 1 - i] * 100).toFixed(1) + '%'
            })
            .attr('class', 'label_text')
            .attr('transform', 'translate(' + blockW / 2 + ',' + (blockH / textOrder.length / 2 + radius / 4) + ')')

        textBox.append('text').text('First').attr('class', 'label_text').style('text-anchor', 'start')
        textBox.append('text').attr('class', 'label_text').text(textOrder[textOrder.length - 1 - i]).style('text-anchor', 'start')
    }
}

function drawFirstControl(div, data, maxH, cScale) {
    let blockH = maxH * 0.8,
        blockW = 40,
        midW = blockW * 3,
        leftText = div.append('div').style('width', blockW + 'px').style('height', blockH + 'px').attr('class', 'colFlex'),
        midChart = div.append('div').style('width', midW + 'px').style('height', blockH * 1.1 + 'px'),
        rightText = div.append('div').style('width', blockW + 'px').style('height', blockH + 'px').attr('class', 'colFlex'),
        midSVG = midChart.append('svg').attr('width', midW).attr('height', blockH * 1.2);
    let wordDict = [
        ['First 黑暗暴君', 2],
        ['First 暴君', 1],
        ['First Blood', 0],
        ['First 风暴龙王', 3],
        ['First 主宰', 4],
        ['First 先知主宰', 5]
    ];

    let wScale = d3.scaleLinear().domain([0, 1]).range([0, midW / 2]);

    for (let i = 0; i < 3; i++) {
        let textBlockL = leftText.append('div').attr('class', 'colFlex').style('justify-content', 'center').style('width', 'inherit').style('height', blockH / 3 + 'px')
        textBlockL.append('text').attr('class', 'label_text').text('First').style('text-anchor', 'end')
        textBlockL.append('text').attr('class', 'label_text').text(wordDict[i][0].split(' ')[1]).style('text-anchor', 'end')
        let textBlockR = rightText.append('div').attr('class', 'colFlex').style('justify-content', 'center').style('width', 'inherit').style('height', blockH / 3 + 'px')
        textBlockR.append('text').attr('class', 'label_text').text('First').style('text-anchor', 'end')
        textBlockR.append('text').attr('class', 'label_text').text(wordDict[i + 3][0].split(' ')[1]).style('text-anchor', 'start')

        midSVG.append('rect')
            .attr('width', function() {
                if (data[wordDict[i][1]] != -1) {
                    return wScale(data[wordDict[i][1]])
                } else {
                    return midW / 2
                }
            })
            .attr('height', blockH / 3)
            .attr('x', function() {
                if (data[wordDict[i][1]] != -1) {
                    return midW / 2 - wScale(data[wordDict[i][1]])
                } else {
                    return 0
                }
            })
            .attr('y', blockH / 3 * i)
            .attr('fill', function() {
                if (data[wordDict[i][1]] > 0.5) {
                    return cScale['more']
                } else if (data[wordDict[i][1]] >= 0) {
                    return cScale['less']
                } else {
                    return 'grey'
                }
            })
            .style('opacity', function() {

                if (data[wordDict[i][1]] > 0.5) {
                    return data[wordDict[i][1]]
                } else {
                    return 1 - data[wordDict[i][1]]
                }
            })
            .attr('transform', 'translate(0,' + 0.05 * blockH + ')')

        midSVG.append('rect')
            .attr('width', function() {
                if (data[wordDict[i + 3][1]] != -1) {
                    return wScale(data[wordDict[i + 3][1]])
                } else {
                    return midW / 2
                }
            })
            .attr('height', blockH / 3)
            .attr('x', midW / 2)
            .attr('y', blockH / 3 * i)
            .attr('fill', function() {
                if (data[wordDict[i + 3][1]] > 0.5) {
                    return cScale['more']
                } else if (data[wordDict[i + 3][1]] >= 0) {
                    return cScale['less']
                } else {
                    return 'grey'
                }
            })
            .style('opacity', function() {
                if (data[wordDict[i + 3][1]] > 0.5) {
                    return data[wordDict[i + 3][1]]
                } else {
                    return 1 - data[wordDict[i + 3][1]]
                }
            })
            .attr('transform', 'translate(0,' + 0.05 * blockH + ')')

        midSVG.append('rect')
            .attr('width', midW)
            .attr('height', blockH / 3)
            .attr('x', 0)
            .attr('y', blockH / 3 * i)
            .style('fill', 'none')
            .style('stroke', 'grey')
            .attr('transform', 'translate(0,' + 0.05 * blockH + ')')
    }
    midSVG.append('rect').attr('height', blockH * 1.1).attr('width', midW / 2)
        .attr('transform', 'translate(' + midW / 4 + ',0)')
        .style('stroke-width', 2)
        .style('fill', 'none')
        .style('stroke', 'black')

    midSVG.append('path').attr('d', 'M' + midW / 2 + ',0L' + midW / 2 + ',' + blockH * 1.1)
        .style('stroke-width', 2)
        .style('stroke', 'white')

    midSVG.append('text').text('0').attr('transform', 'translate(' + midW / 2 + ',' + 0.05 * blockH + ')').style('text-anchor', 'middle').style('font-size', 8)
    midSVG.append('text').text('50%').attr('transform', 'translate(' + (midW / 4 - 10) + ',' + 0.05 * blockH + ')').style('text-anchor', 'middle').style('font-size', 8)
    midSVG.append('text').text('50%').attr('transform', 'translate(' + (midW * 3 / 4 + 10) + ',' + 0.05 * blockH + ')').style('text-anchor', 'middle').style('font-size', 8)
    midSVG.append('text').text('0').attr('transform', 'translate(' + midW / 2 + ',' + 1.1 * blockH + ')').style('text-anchor', 'middle').style('font-size', 8)
    midSVG.append('text').text('50%').attr('transform', 'translate(' + (midW / 4 - 10) + ',' + 1.1 * blockH + ')').style('text-anchor', 'middle').style('font-size', 8)
    midSVG.append('text').text('50%').attr('transform', 'translate(' + (midW * 3 / 4 + 10) + ',' + 1.1 * blockH + ')').style('text-anchor', 'middle').style('font-size', 8)
}

function drawInvadeHero(div, data, side, maxH, invadeColor, heroTable) {
    let rowHeight = maxH / d3.keys(data).length * 0.9,
        imgSize = rowHeight * 0.9;
    for (let i in data) {
        let tempDiv = div.append('div').attr('class', 'rowFlex')
            .style('justify-content', 'space-around')
            .style('height', rowHeight + 'px')
            .style('width', rowHeight * 5 + 'px')
            .style('background-color', invadeColor[i] + '9f')
        let cntSelfHero = {}
        for (let set in data[i][side]) {
            for (let pick in data[i][side][set]) {
                if (typeof(data[i][side][set][pick]) == typeof("String")) {
                    if (d3.keys(cntSelfHero).includes(data[i][side][set][pick].split(',')[0])) {
                        cntSelfHero[data[i][side][set][pick].split(',')[0]] += 1
                    } else {
                        cntSelfHero[data[i][side][set][pick].split(',')[0]] = 1
                    }
                } else {
                    for (let hero in data[i][side][set][pick]) {
                        if (d3.keys(cntSelfHero).includes(data[i][side][set][pick][hero].split(',')[0])) {
                            cntSelfHero[data[i][side][set][pick][hero].split(',')[0]] += 1
                        } else {
                            cntSelfHero[data[i][side][set][pick][hero].split(',')[0]] = 1
                        }
                    }
                }
            }
        }

        let cntHeroArray = Object.keys(cntSelfHero).map(function(key) {
            return [key, cntSelfHero[key]];
        });
        cntHeroArray.sort(function(a, b) {
            return b[1] - a[1]
        })
        for (let hero = 0; hero < 5; hero++) {
            if (cntHeroArray.length > hero) {
                tempDiv.append('img')
                    .attr('src', '/static/img/Hero_Pic/' + heroTable[cntHeroArray[hero][0]] + '.jpg')
                    .attr('width', () => {
                        if (cntHeroArray[0][1] > 1) {
                            return imgSize / cntHeroArray[0][1] * cntHeroArray[hero][1] + 'px'
                        } else {
                            return imgSize / 2 + 'px'
                        }
                    })
                    .attr('height', () => {
                        if (cntHeroArray[0][1] > 1) {
                            return imgSize / cntHeroArray[0][1] * cntHeroArray[hero][1] + 'px'
                        } else {
                            return imgSize / 2 + 'px'
                        }
                    })
            }
        }
    }
}

function drawInvadePie(div, data, maxH, invadeColor) {
    let maxH_1 = maxH * 0.9,
        radius = maxH_1 / 2,
        legendW = 45,
        legendBox = 10,
        labelText = {
            '0': "和平",
            '1': "被入侵",
            '2': "入侵",
            '3': "互换"
        },
        invadeData = [0, 0, 0, 0]

    for (let i in data) {
        invadeData[data[i]] += 1
    }

    let arc = d3.arc().outerRadius(radius).innerRadius(0),
        labelArc = d3.arc().outerRadius(radius - 30).innerRadius(radius - 30),
        pie = d3.pie().sort(null).value(function(d) { return d });

    let legend = div.append('div').append('svg').attr('width', legendW).attr('height', maxH_1),
        svg = div.append('div').append('svg').attr('width', maxH_1).attr('height', maxH_1).append('g').attr('transform', 'translate(' + maxH_1 / 2 + ',' + maxH_1 / 2 + ')')

    for (let i in invadeColor) {
        legend.append('rect').attr('width', legendBox).attr('height', legendBox)
            .attr('transform', 'translate(' + legendBox / 2 + ',' + legendBox * (Number(i) * 2 + 1) + ')')
            .style('fill', invadeColor[i])
            .style('stroke', 'none')

        legend.append('text').text(labelText[i])
            .attr('transform', 'translate(' + (legendBox / 2 + legendBox * 1.1) + ',' + legendBox * (Number(i) * 2 + 1.9) + ')')
            .style('font-size', legendBox * 0.9)
    }
    let g = svg.selectAll('.arc').data(pie(invadeData)).enter().append('g').attr('class', 'arc');
    g.append('path').attr('d', arc).style('fill', (d, i) => invadeColor[String(i)]).style('opacity', 0.8)
    g.append('text').attr('transform', d => 'translate(' + labelArc.centroid(d) + ')')
        .text(function(d, i) {
            if (d.data != 0) {
                return d.data
            } else {
                return ""
            }
        })
        .attr('class', 'content_text')
}

function drawPlayerInfo(div, data, cScale, heroTable) {
    let sideHeight = div._groups[0][0].clientHeight,
        sideRemindW = 30,
        sideRemind = div.append('div').style('width', sideRemindW + 'px').style('height', sideHeight + 'px').style('background-color', cScale['yellow']),
        playerInfo = div.append('div').style('height', sideHeight + 'px').style('display', 'flex').style('flex-direction', 'column').style('flex-wrap', 'wrap');

    sideRemind.append('svg')
        .style('width', sideRemindW).style('height', sideHeight)
        .append('text').text('player information')
        .attr('transform', 'translate(' + sideRemindW / 1.5 + ',' + sideHeight / 2 + '),rotate(-90)')
        .style('text-anchor', 'middle')
        .style('font-size', sideRemindW / 1.5);

    console.log(data)
    for (let i in data) {
        let marginGap = 2,
            singlePlayer = playerInfo.append('div').style('height', (sideHeight / 3 - marginGap * 2) + 'px').attr('class', 'rowFlex').style('margin-top', marginGap + 'px').style('margin-bottom', marginGap + 'px');

        singlePlayer.append('div').style('width', '20px').style('margin-left', '10px').attr('class', 'colFlex').append('text').text(i).attr('class', 'content_title');

        data[i]['blue']['pickIndex'] = Object.keys(data[i]['blue']['pickIndex']).map(function(key) {
            return [key, data[i]['blue']['pickIndex'][key]]
        })
        data[i]['red']['pickIndex'] = Object.keys(data[i]['red']['pickIndex']).map(function(key) {
            return [key, data[i]['red']['pickIndex'][key]]
        })

        // compute chosen order data
        let transIndex = { 'red': [0, 0, 0, 0], 'blue': [0, 0, 0] }
        for (let index in data[i]['blue']['pickIndex']) {
            if (data[i]['blue']['pickIndex'][index][0] == "0") {
                transIndex['blue'][0] += data[i]['blue']['pickIndex'][index][1]
            }

            if (data[i]['blue']['pickIndex'][index][0] == "1" || data[i]['blue']['pickIndex'][index][0] == "2") {
                transIndex['blue'][1] += data[i]['blue']['pickIndex'][index][1]
            }

            if (data[i]['blue']['pickIndex'][index][0] == "3" || data[i]['blue']['pickIndex'][index][0] == "4") {
                transIndex['blue'][2] += data[i]['blue']['pickIndex'][index][1]
            }
        }
        for (let index in data[i]['red']['pickIndex']) {
            if (data[i]['red']['pickIndex'][index][0] == "0" || data[i]['red']['pickIndex'][index][0] == "1") {
                transIndex['red'][0] += data[i]['red']['pickIndex'][index][1]
            }

            if (data[i]['red']['pickIndex'][index][0] == "2") {
                transIndex['red'][1] += data[i]['red']['pickIndex'][index][1]
            }

            if (data[i]['red']['pickIndex'][index][0] == "3") {
                transIndex['red'][2] += data[i]['red']['pickIndex'][index][1]
            }

            if (data[i]['red']['pickIndex'][index][0] == "4") {
                transIndex['red'][3] += data[i]['red']['pickIndex'][index][1]
            }
        };

        // draw chosen order chart
        let blueOrder = singlePlayer.append('div').attr('class', 'colFlex'),
            blueTag = singlePlayer.append('div').attr('class', 'colFlex'),
            redTag = singlePlayer.append('div').attr('class', 'colFlex'),
            redOrder = singlePlayer.append('div').attr('class', 'colFlex'),
            heroUse = singlePlayer.append('div').attr('class', 'rowFlex'),
            blueHDis = [1, 2, 2],
            redHDis = [2, 1, 1, 1],
            blockH = (sideHeight / 3 - marginGap * 2) / 5,
            blockW = 15,
            tagD = 30,
            blueOrderSVG = blueOrder.append('svg').attr('width', blockW).attr('height', sideHeight / 3),
            redOrderSVG = redOrder.append('svg').attr('width', blockW).attr('height', sideHeight / 3);

        blueOrderSVG.append('rect')
            .attr('width', blockW)
            .attr('height', 5 * blockH)
            .style('fill', 'none')
            .style('stroke', cScale['line'])
        let bTagSVG = blueTag.append('svg').attr('width', tagD).attr('height', sideHeight / 3);
        bTagSVG.append('circle')
            .attr('cx', tagD / 2)
            .attr('cy', sideHeight / 3 / 2)
            .attr('r', tagD / 2)
            .style('fill', function() {
                if (d3.keys(data[i]['blue']['win']).includes('1') && (data[i]['blue']['win']["1"] / d3.sum(transIndex['blue']) > 0.5)) {
                    return cScale['win']
                } else {
                    return cScale['def']
                }
            })
            .style('opacity', function() {
                if (d3.keys(data[i]['blue']['win']).includes('1') && (data[i]['blue']['win']["1"] / d3.sum(transIndex['blue']) > 0.5)) {
                    return data[i]['blue']['win']["1"] / d3.sum(transIndex['blue']) * 0.9
                } else if (d3.keys(data[i]['blue']['win']).includes('1')) {
                    return 1 - data[i]['blue']['win']["1"] / d3.sum(transIndex['blue'])
                } else {
                    return 1
                }
            })
            .style('stroke', function() {
                if (d3.keys(data[i]['blue']['win']).includes('1')) {
                    return 'none'
                } else {
                    return cScale['grey']
                }
            })
        bTagSVG.append('text')
            .text(function() {
                if (d3.keys(data[i]['blue']['win']).includes('1')) {
                    return data[i]['blue']['win']["1"] + '/' + d3.sum(transIndex['blue'])
                } else {
                    return '0/' + d3.sum(transIndex['blue'])
                }
            })
            .attr('transform', 'translate(' + tagD / 2 + ',' + (sideHeight / 3 / 2 + tagD / 5) + ')')
            .style('text-anchor', 'middle')
            .attr('class', 'content_text')
        redOrderSVG.append('rect')
            .attr('width', blockW)
            .attr('height', 5 * blockH)
            .style('fill', 'none')
            .style('stroke', cScale['line'])
        let rTagSVG = redTag.append('svg').attr('width', tagD).attr('height', sideHeight / 3);
        rTagSVG.append('circle')
            .attr('cx', tagD / 2)
            .attr('cy', sideHeight / 3 / 2)
            .attr('r', tagD / 2)
            .style('fill', function() {
                if (d3.keys(data[i]['red']['win']).includes('1') && (data[i]['red']['win']["1"] / d3.sum(transIndex['red']) > 0.5)) {
                    return cScale['win']
                } else {
                    return cScale['def']
                }
            })
            .style('opacity', function() {
                if (d3.keys(data[i]['red']['win']).includes('1') && data[i]['red']['win']["1"] / d3.sum(transIndex['red']) > 0.5) {
                    return data[i]['red']['win']["1"] / d3.sum(transIndex['red']) * 0.9
                } else if (d3.keys(data[i]['red']['win']).includes('1')) {
                    return 1 - data[i]['red']['win']["1"] / d3.sum(transIndex['red'])
                } else {
                    return 1
                }
            })
            .style('stroke', function() {
                if (d3.keys(data[i]['red']['win']).includes('1')) {
                    return 'none'
                } else {
                    return cScale['grey']
                }
            })
        rTagSVG.append('text')
            .text(function() {
                if (d3.keys(data[i]['red']['win']).includes('1')) {
                    return data[i]['red']['win']["1"] + '/' + d3.sum(transIndex['red'])
                } else {
                    return '0/' + d3.sum(transIndex['red'])
                }
            })
            .attr('transform', 'translate(' + tagD / 2 + ',' + (sideHeight / 3 / 2 + tagD / 5) + ')')
            .style('text-anchor', 'middle')
            .attr('class', 'content_text')



        for (let order in transIndex['blue']) {
            blueOrderSVG.append('rect')
                .attr('width', blockW)
                .attr('height', blueHDis[order] * blockH)
                .style('fill', cScale['blue'])
                .style('opacity', transIndex['blue'][order] / d3.sum(transIndex['blue']))
                .attr('transform', function() {
                    let transCount = 0;
                    if (order == 0) {
                        return 'translate(0,0)'
                    } else {
                        for (let y = 0; y < order; y++) {
                            transCount += blueHDis[y]
                        }
                        return 'translate(0,' + (blockH * transCount) + ')'
                    }
                })
        }
        for (let order in transIndex['red']) {
            redOrderSVG.append('rect')
                .attr('width', blockW)
                .attr('height', redHDis[order] * blockH)
                .style('fill', cScale['red'])
                .style('opacity', transIndex['red'][order] / d3.sum(transIndex['red']))
                .attr('transform', function() {
                    let transCount = 0;
                    if (order == 0) {
                        return 'translate(0,0)'
                    } else {
                        for (let y = 0; y < order; y++) {
                            transCount += redHDis[y]
                        }
                        return 'translate(0,' + (blockH * transCount) + ')'
                    }
                })
        }

        // compute use hero
        let usalHero = {};
        for (let side in data[i]) {
            for (let hero in data[i][side]['pickHero']) {
                if (d3.keys(usalHero).includes(hero)) {
                    usalHero[hero][0] += data[i][side]['pickHero'][hero][0]
                    usalHero[hero][1] += data[i][side]['pickHero'][hero][1]
                } else {
                    usalHero[hero] = [data[i][side]['pickHero'][hero][0], data[i][side]['pickHero'][hero][1]]
                }
            }
        }
        usalHero = Object.keys(usalHero).map(function(key) {
            return [key, usalHero[key]]
        })
        usalHero.sort(function(a, b) {
            return b[1][1] - a[1][1]
        })

        // draw usual hero use
        for (let hero = 0; hero < usalHero.length; hero++) {
            if (usalHero[hero][1][1] > 1) {
                let heroTag = heroUse.append('div').attr('class', 'colFlex').style('margin-left', '2px').style('margin-right', '2px'),
                    imgSize = 40,
                    textH = 15;

                heroTag.append('img')
                    .attr('src', '/static/img/Hero_Pic/' + heroTable[usalHero[hero][0]] + '.jpg')
                    .style('width', imgSize + 'px')
                    .style('height', imgSize + 'px')

                let textSVG = heroTag.append('div').style('margin', '0px').append('svg').attr('width', imgSize).attr('height', textH)

                textSVG.append('rect')
                    .attr('height', textH)
                    .attr('width', function() {
                        if (usalHero[hero][1][0] == 0) {
                            return 2
                        } else {
                            return usalHero[hero][1][0] / usalHero[hero][1][1] * imgSize
                        }
                    })
                    .style('fill', function() {
                        if (usalHero[hero][1][0] / usalHero[hero][1][1] > 0.5) {
                            return cScale['win']
                        } else {
                            return cScale['def']
                        }
                    })
                    .style('opacity', () => {
                        if (usalHero[hero][1][0] / usalHero[hero][1][1] > 0.5) {
                            return usalHero[hero][1][0] / usalHero[hero][1][1]
                        } else {
                            return 1 - usalHero[hero][1][0] / usalHero[hero][1][1]
                        }
                    })

                textSVG.append('text')
                    .text(usalHero[hero][1][1] + '次')
                    .attr('class', 'content_text')
                    .attr('transform', 'translate(' + imgSize / 2 + ',' + textH * 3 / 4 + ')')
                    .style('text-anchor', 'middle')
            }

        }

    }
}