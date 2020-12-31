function _drawTeamBlock_d(team_id, season, blockDiv, gameData) {
    let blockWidth = blockDiv._groups[0][0].clientWidth,
        blockHeight = document.getElementsByClassName('leftPanel')[0].clientHeight - 25;

    d3.select('#detail_heroRelation').style('height', blockHeight + 25 + 'px')
    let played = 0;

    let blockCard = blockDiv.append('div').attr('class', 'teamBlock')
        .style('width', blockWidth + 'px')
        .style('height', blockHeight + 'px')


    let blockTitle = blockCard.append('div').attr('class', 'panelTitle')
        .style('background-color', '#8c8888')

    blockTitle.append('h7').text(function() {
            for (let j in gameData) {
                if (gameData[j]['season_id'] == season.split('_')[1]) {
                    return gameData[j]['season_name']
                }
            }
            return '无赛季名称'
        })
        .style('color', '#e7e5e5')

    let blockContent = blockCard.append('div').style('width', (blockWidth - 4) + 'px');

    d3.json('static/rawData/' + season + '/' + season.split('_')[1] + '_Set.json').then(function(setData) {
        let setResp = [];
        for (let set in setData) {
            if (setData[set]['team_id'] == team_id) {
                if (!setResp.includes(setData[set]['game_label'])) {
                    setResp.push(setData[set]['game_label'])
                }
            }
        }
        played = setResp.length;
        _drawTeamHero_d(blockContent, team_id, season, played)
    })
}

function _drawTeamHero_d(div, team_id, season, played) {
    // console.log('team match:', played)
    let width = div._groups[0][0].clientWidth,
        thershold = {
            percent: [played * 0.32, played * 0.16, played * 0.08],
            num: [4, 3, 2]
        },
        selectedGroup = [];
    // console.log(div._groups, width)

    let colorScheme = {
            bg: '#f2eee5',
            title_text: '#222831',
            subtitle_text: '#30475e',
            subtitle_rect: '#c1a57b',
            subtitle_line: '#f3e1e1',
            content_textBox: '#f5d894'
        },
        colorscale = d3.scaleLinear()
        .domain([0, 0.5, 1])
        .range(["#b64343", '#f2eee5', "#43b643"]);

    d3.json('static/rawData/' + season + '/' + season.split('_')[1] + '_Team/' + season.split('_')[1] + '_' + team_id + '_fpgrowth.json').then(function(teamP) {
        let single_div = div.append('div').attr('class', 'teamMatch'),
            double_div = div.append('div').attr('class', 'teamMatch'),
            tripple_div = div.append('div').attr('class', 'teamMatch'),
            group_div = div.append('div').attr('class', 'teamMatch');

        // content part
        let colNum = 6,
            imgSize = width / colNum * 0.85 - 2,
            imgGap = width / colNum * 0.1;

        for (let ind in teamP['sup_resp']) {
            for (let i in teamP['sup_resp'][ind]) {
                let minTh = d3.max([thershold.num[Number(ind) - 1], thershold.percent[Number(ind) - 1]])
                if (teamP['sup_resp'][ind][i][1][0] <= minTh) {
                    teamP['sup_resp'][ind].splice(i, teamP['sup_resp'][ind].length - i)
                    break
                }
            }
        }

        let single_title = single_div.append('div').attr('class', 'teamMatchCard'),
            double_title = double_div.append('div').attr('class', 'teamMatchCard');

        _drawLogo(single_title, "单", imgSize, colorScheme)
        _drawLogo(double_title, "双", imgSize, colorScheme)

        zeroRemind(single_div, teamP, thershold, 1, "英雄", colorScheme)
        zeroRemind(double_div, teamP, thershold, 2, "组合", colorScheme)

        _drawSingleHero(teamP, 1, single_div, selectedGroup, team_id, season, imgSize, colorscale)
        _drawSingleHero(teamP, 2, double_div, selectedGroup, team_id, season, imgSize, colorscale)

        if (d3.keys(teamP['sup_resp']).length > 2 && teamP['sup_resp']['3'].length != 0) {
            let tripple_title = tripple_div.append('div').attr('class', 'teamMatchCard');
            _drawLogo(tripple_title, "三", imgSize, colorScheme)

            _drawSingleHero(teamP, 3, tripple_div, selectedGroup, team_id, season, imgSize, colorscale)
        }
    })
}

function _drawLogo(div, specText, sizeLen, cScale) {
    let logo = div.append('div').append('svg').attr('width', sizeLen).attr('height', sizeLen);

    logo.append('circle')
        .attr('r', sizeLen / 2)
        .attr('cx', sizeLen / 2)
        .attr('cy', sizeLen / 2)
        .style('fill', cScale.subtitle_text)
        .style("stroke", cScale.subtitle_line)
        .style('stroke-width', 3)
    logo.append('text')
        .text(specText)
        .style('font-size', sizeLen / 2)
        .style('fill', '#f6bf4f')
        .style('text-anchor', 'middle')
        .style('font-weight', 'bolder')
        .attr('transform', 'translate(' + sizeLen / 2 + ',' + sizeLen * 0.65 + ')')

    div.append('div').append('p').text('(出场次数/').attr('class', 'cardTips')
    div.append('div').append('p').text('胜率)').attr('class', 'cardTips')
}

function zeroRemind(div, data, the, index, label, cScale) {
    if (data['sup_resp'][String(index)].length == 0) {
        div.append('div').append('text')
            .text('没有出场率>' + (the.percent[0] * 100).toFixed(0) + '%（或出场>' + the.num[0] + '次）的' + label)
            .attr('class', 'contentLabel')
            .style('color', cScale.subtitle_text)
            .style('text-anchor', 'middle')
            .style('font-weight', 'bolder')
    }

}

function _drawSingleHero(data, index, div, selected, team_id, season, sizeLen, cScale) {
    for (let i = 0; i < data['sup_resp'][String(index)].length; i++) {
        let temp_div = div.append('div').attr('class', 'teamMatchCard non_chosen').on('click', function() {
            if (selected.includes(data['sup_resp'][String(index)][i][0])) {
                selected.splice(selected.indexOf(data['sup_resp'][String(index)][i][0]), 1)

                d3.select(this).attr('class', 'teamMatchCard non_chosen')

                d3.select('#' + season + '_' + team_id + '_' + String(data['sup_resp'][String(index)][i][0]).replace(/,/g, "_")).remove()
            } else {
                _drawHeroRelation(data['sup_resp'][String(index)][i], team_id, season)
                selected.push(data['sup_resp'][String(index)][i][0])

                d3.select(this).attr('class', 'teamMatchCard chosen')
            }
        })
        for (let hero = 0; hero < index; hero++) {
            temp_div.append('img')
                .attr('src', 'static/img/Hero_Pic/' + data['sup_resp'][String(index)][i][0][hero] + '.jpg')
                .style('width', sizeLen + 'px')
                .style('height', sizeLen + 'px')
        }
        let textCard = temp_div.append('div').style('width', sizeLen + 'px').style('background-color', function() {
            if (data['sup_resp'][String(index)][i][1][1] > 0.5) {
                return cScale(data['sup_resp'][String(index)][i][1][1])
            } else {
                return cScale(data['sup_resp'][String(index)][i][1][1])
            }
        }).attr('class', 'teamMatchText')
        textCard.append('text')
            .attr('class', 'contentLabel')
            .text(data['sup_resp'][String(index)][i][1][0] + '/' + String((data['sup_resp'][String(index)][i][1][1] * 100).toFixed(1)) + '%')
            .style('font-size', sizeLen / 5 + 'px')
            .style('font-weight', function() {
                if (data['sup_resp'][String(index)][i][1][1] > 0.5) {
                    return 'bolder'
                } else {
                    return 'normal'
                }
            })
    };
}

function _drawHeroRelation(rec, team_id, season) {
    // console.log(rec, team_id, season)
    let blockW = document.getElementById('detail_heroRelation').clientWidth,
        blockH = 210,
        imgSize = 50,
        listImgSize = 40,
        heroRelation_div = d3.select('#detail_heroRelation').append('div').attr('class', 'rowFlex')
        .attr('id', season + '_' + team_id + '_' + String(rec[0]).replace(/,/g, "_"))
        .style('width', blockW + 'px')
        .style('height', blockH + 'px'),
        heroImg = heroRelation_div.append('div').style('width', blockH / 1.5 + 'px').style('height', blockH + 'px')
        .attr('class', 'rowFlex').style('flex-wrap', 'wrap')
        .style('border', '2px grey solid')
        .style('background', '#cdddf2')
        .style('justify-content', 'space-around')
        .style('float', 'right'),
        heroRel = heroRelation_div.append('div').style('height', blockH + 'px')
        .attr('class', 'colFlex')
        .style('border', '2px #f2e2cd solid'),
        heroWMore = heroRel.append('div').style('height', blockH / 3 + 'px').style('width', (blockW - blockH) + 'px')
        .attr('class', 'rowFlex')
        .style('background', '#f0f2cd')
        .style('overflow-x', 'scroll'),
        heroWSame = heroRel.append('div').style('height', blockH / 3 + 'px').style('width', (blockW - blockH) + 'px')
        .attr('class', 'rowFlex')
        .style('background', '#f2e2cd')
        .style('overflow-x', 'scroll'),
        heroWLess = heroRel.append('div').style('height', blockH / 3 + 'px').style('width', (blockW - blockH) + 'px')
        .attr('class', 'rowFlex')
        .style('background', '#f2d0cd')
        .style('overflow-x', 'scroll');

    for (let hero = 0; hero < rec[0].length; hero++) {
        heroImg.append('img')
            .attr('src', 'static/img/Hero_Pic/' + rec[0][hero] + '.jpg')
            .style('width', imgSize + 'px')
            .style('height', imgSize + 'px')
    }

    let fileName = "["
    if (rec[0].length == 1) {
        fileName = fileName + String(rec[0][0]) + ']'
    } else {
        for (let i in rec[0]) {
            if (i == rec[0].length - 1) {
                fileName = fileName + String(rec[0][i]) + ']'
            } else {
                fileName = fileName + String(rec[0][i]) + ', '
            }

        }
    }

    let selfPath = 'static/rawData/' + season + '/' + season.split('_')[1] + '_Team/' + team_id + '/' + fileName + '.json',
        otherPath = 'static/rawData/' + season + '/' + season.split('_')[1] + '_Team/' + team_id + '/' + fileName + '_o.json'

    d3.json(selfPath).then(function(relData) {
        d3.json(otherPath).then(function(otherData) {
            // console.log(relData)
            // console.log(otherData)
            relData['sup_resp'].sort(function(a, b) {
                if (a[1][1] == b[1][1]) {
                    return b[1][0] - a[1][0]
                } else {
                    return b[1][1] - a[1][1]
                }
            })

            for (let i in relData['sup_resp']) {
                if (relData['sup_resp'][i][1][1] > 0.5) {
                    _drawRelation(heroWMore, relData, otherData, i, listImgSize)
                } else if (relData['sup_resp'][i][1][1] == 0.5) {
                    _drawRelation(heroWSame, relData, otherData, i, listImgSize)

                } else {
                    _drawRelation(heroWLess, relData, otherData, i, listImgSize)
                }
            }

        })
    })
}

function _drawRelation(div, selfData, othData, setIndex, imgSize) {
    let block = div.append('div').attr('class', 'colFlex listMode'),
        blockImg = block.append('div').attr('class', 'rowFlex');

    for (let hero in selfData['sup_resp'][setIndex][0]) {
        blockImg.append('img')
            .attr('src', 'static/img/Hero_Pic/' + selfData['sup_resp'][setIndex][0][hero] + '.jpg')
            .style('height', imgSize + 'px')
            .style('width', imgSize + 'px')
    }

    let othBlock = blockImg.append('div').style('border', '1px solid black').attr('class', 'colFlex')
        .style('height', imgSize + 'px')
        .style('width', imgSize + 'px'),
        textSize = 9;

    othBlock.append('text').text('其他队').style('font-size', textSize + 'px')
    let othFlag = 0;
    for (let j = 0; j < othData['sup_resp'].length; j++) {
        if (_judgeArrSame(othData['sup_resp'][j][0], selfData['sup_resp'][setIndex][0])) {
            othFlag = 1
            othBlock.append('text').text(othData['sup_resp'][j][1][0] + '局').style('font-size', textSize + 'px')
            othBlock.append('text').text((othData['sup_resp'][j][1][1] * 100).toFixed(1) + '%').style('font-size', textSize + 'px')
        }
    }
    if (!othFlag) {
        othBlock.append('text').text('无记录').style('font-size', textSize + 'px')
    }

    block.append('text').text(selfData['sup_resp'][setIndex][1][0] + '局 ' + (selfData['sup_resp'][setIndex][1][1] * 100).toFixed(1) + '%')
        .attr('class', 'listText')
}

function _judgeArrSame(a, b) {
    if (a.length !== b.length) {
        return false
    } else {
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false
            }
        }
        return true
    }
}