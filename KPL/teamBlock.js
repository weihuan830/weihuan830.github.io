function _drawTeamBlock(team_id, season, blockDiv, teamData, gameData, selected) {
    let blockWidth = 250,
        blockHeight = document.getElementsByClassName('leftPanel')[0].clientHeight - 25;
    var played = 0;

    let blockCard = blockDiv.append('div').attr('class', 'teamBlock')
        .style('width', blockWidth + 'px')
        .style('height', blockHeight + 'px')
    let delButton = blockDiv.append('div').attr('class', 'delButton')
        .on('click', function() {
            for (let i in selected[season]['team']) {
                if (selected[season]['team'][i] == team_id) {
                    selected[season]['team'].splice(i, 1)
                }
            }
            d3.select('#teamView_' + team_id + '_' + season).remove()
            d3.select('#teamTab_' + team_id + '_' + season).attr('class', 'non_chosen')

        })

    delButton.append('text')
        .text('移除该选择')


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

    let blockSubtitle = blockCard.append('div').style('width', blockWidth - 4)
        .attr('class', 'panelTitle')
        .style('flex-direction', 'column'),
        blockLogo = blockSubtitle.append('div').style('display', 'flex')
        .style('flex-direction', 'row')
        .style('align-items', 'center')
        .style('color', '#595959'),
        blockContent = blockCard.append('div').style('width', blockWidth - 4);

    blockLogo.append('img')
        .attr('src', 'KPL/static/img/Team_Pic/' + team_id + '.png')
        .style('width', '50px')
        .style('height', '50px')

    blockLogo.append('text').text(function() {
            for (let i in teamData) {
                if (teamData[i]['team_id'] == String(team_id)) {
                    played = parseInt(teamData[i]['played'])
                    return teamData[i]['team_name']
                }
            }
        })
        .style('font-size', '16px')
        .style('font-weight', 'bolder')
        .style('color', '#000')

    d3.json('KPL/static/rawData/' + season + '/' + season.split('_')[1] + '_Set.json').then(function(setData) {
        let setResp = [];
        for (let set in setData) {
            if (setData[set]['team_id'] == team_id) {
                if (!setResp.includes(setData[set]['game_label'])) {
                    setResp.push(setData[set]['game_label'])
                }
            }
        }

        for (let team in teamData) {
            if (teamData[team]['team_id'] == team_id) {
                blockSubtitle.append('div').append('p')
                    .text('共' + setResp.length + '大场: ' + teamData[team].played + '局/胜率' + (Number(teamData[team].win_rate) * 100).toFixed(1) + '%')
                    .style('font-weight', 'bolder')
            }
        }
        played = setResp.length;
    })


    _drawTeamHero(blockContent, team_id, season, played)


}

function _drawTeamHero(div, team_id, season, played) {
    let width = div._groups[0][0].clientWidth,
        thershold = {
            percent: [0.1, 0.1, 0.05],
            num: [4, 2, 2]
        };

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

    d3.json('KPL/static/rawData/' + season + '/' + season.split('_')[1] + '_Team/' + season.split('_')[1] + '_' + team_id + '_fpgrowth.json').then(function(teamP) {
        let single_div = div.append('div').attr('class', 'teamMatch'),
            double_div = div.append('div').attr('class', 'teamMatch'),
            tripple_div = div.append('div').attr('class', 'teamMatch'),
            group_div = div.append('div').attr('class', 'teamMatch');

        // content part
        let colNum = 5,
            imgSize = width / colNum * 0.85,
            imgGap = width / colNum * 0.1;

        for (let ind in teamP['sup_resp']) {
            for (let i in teamP['sup_resp'][ind]) {
                let minTh = d3.max([thershold.num[Number(ind) - 1], played * thershold.percent[Number(ind) - 1]])
                if (teamP['sup_resp'][ind][i][1][0] <= minTh) {
                    teamP['sup_resp'][ind].splice(i, teamP['sup_resp'][ind].length - i)
                    break
                }
            }
        }

        let single_title = single_div.append('div').attr('class', 'teamMatchCard'),
            double_title = double_div.append('div').attr('class', 'teamMatchCard');

        let singleLogo = single_title.append('div').append('svg').attr('width', imgSize).attr('height', imgSize),
            doubleLogo = double_title.append('div').append('svg').attr('width', imgSize).attr('height', imgSize);
        singleLogo.append('circle')
            .attr('r', imgSize / 2)
            .attr('cx', imgSize / 2)
            .attr('cy', imgSize / 2)
            .style('fill', colorScheme.subtitle_text)
            .style("stroke", colorScheme.subtitle_line)
            .style('stroke-width', 3)
        singleLogo.append('text')
            .text('单')
            .style('font-size', imgSize / 2)
            .style('fill', '#f6bf4f')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bolder')
            .attr('transform', 'translate(' + imgSize / 2 + ',' + imgSize * 0.65 + ')')

        single_title.append('div').append('p').text('(出场次数/').attr('class', 'cardTips')
        single_title.append('div').append('p').text('胜率)').attr('class', 'cardTips')

        if (teamP['sup_resp']['1'].length == 0) {
            single_div.append('div').append('text')
                .text('没有出场率>' + (thershold.percent[0] * 100).toFixed(0) + '%（或出场>' + thershold.num[0] + '次）的英雄')
                .attr('class', 'contentLabel')
                .style('color', colorScheme.subtitle_text)
                .style('text-anchor', 'middle')
                .style('font-weight', 'bolder')
        }

        for (let i = 0; i < teamP['sup_resp']['1'].length; i++) {
            let temp_div = single_div.append('div').attr('class', 'teamMatchCard')
            temp_div.append('img')
                .attr('src', 'KPL/static/img/Hero_Pic/' + teamP['sup_resp']['1'][i][0][0] + '.jpg')
                .style('width', imgSize + 'px')
                .style('height', imgSize + 'px')
            let textCard = temp_div.append('div').style('width', imgSize + 'px').style('background-color', function() {
                if (teamP['sup_resp']['1'][i][1][1] > 0.5) {
                    // return '#c3e3c3'
                    return colorscale(teamP['sup_resp']['1'][i][1][1])
                } else {
                    // return colorScheme.content_textBox
                    return colorscale(teamP['sup_resp']['1'][i][1][1])
                }
            }).attr('class', 'teamMatchText')
            textCard.append('text')
                .attr('class', 'contentLabel')
                .text(teamP['sup_resp']['1'][i][1][0] + '/' + String((teamP['sup_resp']['1'][i][1][1] * 100).toFixed(1)) + '%')
                .style('font-size', imgSize / 5 + 'px')
                .style('font-weight', function() {
                    if (teamP['sup_resp']['1'][i][1][1] > 0.5) {
                        return 'bolder'
                    } else {
                        return 'normal'
                    }
                })
        };


        doubleLogo.append('circle')
            .attr('r', imgSize / 2)
            .attr('cx', imgSize / 2)
            .attr('cy', imgSize / 2)
            .style('fill', colorScheme.subtitle_text)
            .style("stroke", colorScheme.subtitle_line)
            .style('stroke-width', 3)
        doubleLogo.append('text')
            .text('双')
            .style('font-size', imgSize / 2)
            .style('fill', '#f6bf4f')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bolder')
            .attr('transform', 'translate(' + imgSize / 2 + ',' + imgSize * 0.65 + ')')

        double_title.append('div').append('p').text('(出场次数/').attr('class', 'cardTips')
        double_title.append('div').append('p').text('胜率)').attr('class', 'cardTips')

        if (teamP['sup_resp']['2'].length == 0) {
            double_div.append('div').append('text')
                .text('没有出场率>' + (thershold.percent[1] * 100).toFixed(0) + '%（或出场>' + thershold.num[1] + '次）的双组合')
                .attr('class', 'contentLabel')
                .style('color', colorScheme.subtitle_text)
                .style('text-anchor', 'middle')
                .style('font-weight', 'bolder')
        }

        for (let i = 0; i < teamP['sup_resp']['2'].length; i++) {
            let temp_div = double_div.append('div').attr('class', 'teamMatchCard')
            for (let hero = 0; hero < 2; hero++) {
                temp_div.append('img')
                    .attr('src', 'KPL/static/img/Hero_Pic/' + teamP['sup_resp']['2'][i][0][hero] + '.jpg')
                    .style('width', imgSize + 'px')
                    .style('height', imgSize + 'px');
            }
            let textCard = temp_div.append('div').style('width', imgSize + 'px').style('background-color', function() {
                if (teamP['sup_resp']['2'][i][1][1] > 0.5) {
                    // return '#c3e3c3'
                    return colorscale(teamP['sup_resp']['2'][i][1][1])
                } else {
                    // return colorScheme.content_textBox
                    return colorscale(teamP['sup_resp']['2'][i][1][1])
                }
            }).attr('class', 'teamMatchText')

            textCard.append('text')
                .attr('class', 'contentLabel')
                .text(teamP['sup_resp']['2'][i][1][0] + '/' + String((teamP['sup_resp']['2'][i][1][1] * 100).toFixed(1)) + '%')
                .style('font-size', imgSize / 5 + 'px')
                .style('font-weight', function() {
                    if (teamP['sup_resp']['2'][i][1][1] > 0.5) {
                        return 'bolder'
                    } else {
                        return 'normal'
                    }
                })
        };

        if (d3.keys(teamP['sup_resp']).length > 2 && teamP['sup_resp']['3'].length != 0) {
            let tripple_title = tripple_div.append('div').attr('class', 'teamMatchCard'),
                trippleLogo = tripple_title.append('svg').attr('width', imgSize).attr('height', imgSize);

            trippleLogo.append('circle')
                .attr('r', imgSize / 2)
                .attr('cx', imgSize / 2)
                .attr('cy', imgSize / 2)
                .style('fill', colorScheme.subtitle_text)
                .style("stroke", colorScheme.subtitle_line)
                .style('stroke-width', 3)
            trippleLogo.append('text')
                .text('三')
                .style('font-size', imgSize / 2)
                .style('fill', '#f6bf4f')
                .style('text-anchor', 'middle')
                .style('font-weight', 'bolder')
                .attr('transform', 'translate(' + imgSize / 2 + ',' + imgSize * 0.65 + ')')

            tripple_title.append('div').append('p').text('(出场次数/').attr('class', 'cardTips')
            tripple_title.append('div').append('p').text('胜率)').attr('class', 'cardTips')

            for (let i = 0; i < teamP['sup_resp']['3'].length; i++) {
                let temp_div = tripple_div.append('div').attr('class', 'teamMatchCard')
                for (let hero = 0; hero < 3; hero++) {
                    temp_div.append('img')
                        .attr('src', 'KPL/static/img/Hero_Pic/' + teamP['sup_resp']['3'][i][0][hero] + '.jpg')
                        .style('width', imgSize + 'px')
                        .style('height', imgSize + 'px');
                }

                let textCard = temp_div.append('div').style('width', imgSize + 'px').style('background-color', function() {
                    if (teamP['sup_resp']['3'][i][1][1] > 0.5) {
                        // return '#c3e3c3'
                        return colorscale(teamP['sup_resp']['3'][i][1][1])
                    } else {
                        // return colorScheme.content_textBox
                        return colorscale(teamP['sup_resp']['3'][i][1][1])
                    }
                }).attr('class', 'teamMatchText')

                textCard.append('text')
                    .attr('class', 'contentLabel')
                    .text(teamP['sup_resp']['3'][i][1][0] + '/' + String((teamP['sup_resp']['3'][i][1][1] * 100).toFixed(1)) + '%')
                    .style('font-size', imgSize / 5 + 'px')
                    .style('font-weight', function() {
                        if (teamP['sup_resp']['3'][i][1][1] > 0.5) {
                            return 'bolder'
                        } else {
                            return 'normal'
                        }
                    })
            };
        }

        let match_title = group_div.append('div').attr('class', 'teamMatchCard'),
            matchLogo = match_title.append('svg').attr('width', imgSize).attr('height', imgSize)
        matchLogo.append('circle')
            .attr('r', imgSize / 2)
            .attr('cx', imgSize / 2)
            .attr('cy', imgSize / 2)
            .style('fill', colorScheme.subtitle_text)
            .style("stroke", colorScheme.subtitle_line)
            .style('stroke-width', 3)
        matchLogo.append('text')
            .text('配')
            .style('font-size', imgSize / 2)
            .style('fill', '#f6bf4f')
            .style('text-anchor', 'middle')
            .style('font-weight', 'bolder')
            .attr('transform', 'translate(' + imgSize / 2 + ',' + imgSize * 0.65 + ')')

        match_title.append('div').append('p').text('(置信度/').attr('class', 'cardTips')
        match_title.append('div').append('p').text('搭配次数)').attr('class', 'cardTips')

        for (let i = 0; i < teamP['rule'].length; i++) {
            if (teamP['rule'][i][3] * teamP['rule'][i][2] < 3) {
                teamP['rule'].splice(i, 1)
                i = i - 1

            }
        }

        if (teamP['rule'].length == 0) {
            group_div.append('div').append('text')
                .text('没有置信度>60%且出场>2次的匹配')
                .attr('class', 'contentLabel')
                .style('color', colorScheme.subtitle_text)
                .style('text-anchor', 'middle')
                .style('font-weight', 'bolder')
        }

        for (let grp in teamP['rule']) {
            let maxG = d3.max([teamP['rule'][grp][0].length, teamP['rule'][grp][1].length])
            let temp_div = group_div.append('div').attr('class', 'teamMatchCard'),
                first_layer = temp_div.append('div').style('width', (maxG * (imgSize + imgGap) - imgGap) + 'px')
                .style('display', 'flex').style('flex-direction', 'row')
                .style('justify-content', 'center'),
                text_layer = temp_div.append('div').style('width', (maxG * (imgSize + imgGap) - imgGap) + 'px')
                .style('background-color', colorScheme.content_textBox).attr('class', 'teamMatchText'),
                second_layer = temp_div.append('div').style('width', (teamP['rule'][grp][0].length * (imgSize + imgGap) - imgGap) + 'px')
                .style('display', 'flex').style('flex-direction', 'row')
                .style('justify-content', 'center')

            for (let hr in teamP['rule'][grp][0]) {
                first_layer.append('img')
                    .attr('src', 'KPL/static/img/Hero_Pic/' + teamP['rule'][grp][0][hr] + '.jpg')
                    .style('width', imgSize + 'px')
                    .style('height', imgSize + 'px')
            }

            text_layer.append('text')
                .attr('class', 'contentLabel')
                .text((teamP['rule'][grp][2] * 100).toFixed(0) + '%/' + teamP['rule'][grp][2] * teamP['rule'][grp][3])
                .style('font-size', imgSize / 5 + 'px')

            for (let hr in teamP['rule'][grp][1]) {
                second_layer.append('img')
                    .attr('src', 'KPL/static/img/Hero_Pic/' + teamP['rule'][grp][1][hr] + '.jpg')
                    .style('width', imgSize + 'px')
                    .style('height', imgSize + 'px')
            }

        }


    })
}