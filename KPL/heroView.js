function _drawHeroView(hero_id, hero_name, season, blockDiv, heroInfo, gameData, selected) {
    let blockWidth = 250,
        blockHeight = document.getElementsByClassName('leftPanel')[0].clientHeight - 25;

    let blockCard = blockDiv.append('div').attr('class', 'heroBlock')
        .style('width', blockWidth + 'px')
        .style('height', blockHeight + 'px')

    let delButton = blockDiv.append('div').attr('class', 'delButton')
        .on('click', function() {
            for (let i in selected[season]['hero']) {
                if (selected[season]['hero'][i] == hero_name) {
                    selected[season]['hero'].splice(i, 1)
                }
            }
            d3.select('#heroView_' + hero_id + '_' + season).remove()
            d3.select('#heroTab_' + hero_id + '_' + season).attr('class', 'non_chosen')

        })

    delButton.append('text')
        .text('移除该选择')

    let blockTitle = blockCard.append('div').attr('class', 'panelTitle')
        .style('background-color', '#8c8888'),
        blockContent = blockCard.append('div').style('width', blockWidth - 6);

    blockTitle.append('h7').text(function() {
            for (let j in gameData) {
                if (gameData[j]['season_id'] == season.split('_')[1]) {
                    return gameData[j]['season_name']
                }
            }
            return '无赛季名称'
        })
        .style('color', '#e7e5e5')

    let setNum = 0,
        matchNum = 0;
    d3.json('static/rawData/' + season + '/' + season.split('_')[1] + '_Set.json').then(function(setData) {
        let setResp = [],
            setList = 0;
        for (let set in setData) {
            if (!setResp.includes(setData[set]['game_label'])) {
                setResp.push(setData[set]['game_label'])
            }
            if (setData[set]['camp'] == "1") {
                setList = setList + 1
            }
        }
        matchNum = setResp.length;
        setNum = setList;



        d3.json('static/rawData/' + season + '/' + season.split('_')[1] + '_Hero.json').then(function(heroData) {

            let hero_basic = blockContent.append('div').attr('class', 'panelTitle')
                .style('display', 'flex')
                .style('flex-direction', 'column'),
                hero_match = blockContent.append('div').attr('class', 'panelTitle')
                .style('display', 'flex')
                .style('flex-direction', 'column'),
                hero_windef = blockContent.append('div');


            // Block 1: Hero Basic Information
            hero_basic.append('img')
                .attr('src', 'static/img/Hero_Pic/' + hero_id + '.jpg')
                .attr('width', '50px')
                .attr('height', '50px')
            hero_basic.append('p').text(hero_name).style('font-weight', 'bolder')

            let NBNPFlag = 1;
            for (let j in heroData) {
                if (heroData[j].hero_name == hero_name) {
                    NBNPFlag = 0
                    hero_basic.append('p').text('被Ban次数/赛季总局数: ' + heroData[j].ban_cnt + '/' + String(setNum))
                    hero_basic.append('p').text('出场次数(胜率)/赛季总场数: ' + heroData[j].pick_cnt + '(' + String((Number(heroData[j].win_rate) * 100).toFixed(1)) + '%)/' + String(matchNum))
                }
            }
            if (NBNPFlag) {
                hero_basic.append('p').text('被Ban次数: 0')
                hero_basic.append('p').text('出场次数/胜率: 0/无')
            }

            // Block 2: General Match
            d3.json('static/rawData/' + season + '/' + season.split('_')[1] + '_Group.json').then(function(groupData) {
                hero_match.append('h5').attr('class', 'panelTitle').text('常见搭配')

                // store the matches in 'matchResp'
                let matchResp = {
                        '1': [],
                        '2': [],
                        '3': [],
                        '4': [],
                        '5': [],
                        '6': []
                    },
                    locRel = {
                        '1': '刺客',
                        '2': '法师',
                        '3': '射手',
                        '4': '坦克',
                        '5': '战士',
                        '6': '辅助'
                    },
                    colorscale = d3.scaleLinear()
                    .domain([0, 0.5, 1])
                    .range(["#b64343", '#e5e9f2', "#43b643"]);
                for (let j in groupData) {
                    if (groupData[j].hero1_id == hero_id) {
                        for (let hero in heroInfo) {
                            if (heroInfo[hero].hero_id == groupData[j].hero2_id) {
                                matchResp[heroInfo[hero].hero_type].push([groupData[j].hero2_id, groupData[j].hero2_name, groupData[j].played, groupData[j].win_rate])
                            }
                        }
                    }
                    if (groupData[j].hero2_id == hero_id) {
                        for (let hero in heroInfo) {
                            if (heroInfo[hero].hero_id == groupData[j].hero1_id) {
                                matchResp[heroInfo[hero].hero_type].push([groupData[j].hero1_id, groupData[j].hero1_name, groupData[j].played, groupData[j].win_rate])
                            }
                        }
                    }
                };

                // draw match part
                for (let key in matchResp) {
                    let locDiv = hero_match.append('div').style('width', '-webkit-fill-available').style('display', 'flex').style('flex-direction', 'row').style('align-items', 'center').style('justify-content', 'space-around')
                    locDiv.append('text').text(locRel[key] + ': ')
                    if (matchResp[key].length != 0) {
                        for (let hero in matchResp[key]) {
                            if (hero < 4) {
                                let heroDiv = locDiv.append('div').style('display', 'flex').style('flex-direction', 'column').style('align-items', 'center').style('justify-content', 'space-around')
                                    .style('background-color', function() {
                                        if (Number(matchResp[key][hero][3]) > 0.5) {
                                            // return '#c3e3c3'
                                            return colorscale(matchResp[key][hero][3])
                                        } else {
                                            return colorscale(matchResp[key][hero][3])
                                        }
                                    })
                                heroDiv.append('img')
                                    .attr('src', 'static/img/Hero_Pic/' + matchResp[key][hero][0] + '.jpg')
                                    .attr('width', '45px')
                                    .attr('height', '45px')

                                heroDiv.append('text')
                                    .text(matchResp[key][hero][2] + '/' + (Number(matchResp[key][hero][3]) * 100).toFixed(1) + '%')
                                    .attr('class', 'contentLabel')
                                    .style('font-weight', function() {
                                        if (Number(matchResp[key][hero][3]) > 0.5) {
                                            return 'bolder'
                                        } else {
                                            return 'bolder'
                                        }
                                    })
                            }
                        }
                    } else {
                        locDiv.append('text').text('无常见搭配')
                    }
                }

            })

            // Block 3: Win/Defeat Relation
            let windef_title = hero_windef.append('div').attr('class', 'panelTitle')
                .style('background-color', '#8c8888'),
                windef_content = hero_windef.append('div').append('svg');
            windef_title.append('h7').text('所有赛季胜负关系统计')
                .style('color', '#e7e5e5')

            let windef_H = 450;
            windef_content.attr('width', blockWidth - 6).attr('height', windef_H)

            drawHeroWinDef(hero_name, hero_id, windef_content)
        })
    })

}


function drawHeroWinDef(heroName, heroID, svg) {
    svg.selectAll('*').remove()

    let width = svg._groups[0][0].clientWidth - 10,
        height = svg._groups[0][0].clientHeight - 10,
        borderWidth = 4,
        textTrans = 3;
    let margin = {
        left: 5,
        top: 5,
        right: 5,
        bottom: 5
    };

    svg.append('rect')
        .attr('width', borderWidth)
        .attr('height', height)
        .attr('transform', 'translate(' + (margin.left + (width - borderWidth) / 2) + ',' + margin.top + ')')
        .style('fill', '#fabc60')
        .style('opacity', 0.5)
        .attr('z-index', -1)

    let relation_g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + (margin.top * 2.2) + ')')

    d3.json('static/rawData/HeroWinDef/heroFight_10_31.json').then(function(heroRelation) {

        let heroSep = heroRelation[heroID],
            winM = [],
            defM = [],
            maxTime = 0

        for (let hero in heroSep) {
            if (heroSep[hero][1] > maxTime) {
                maxTime = heroSep[hero][1]
            }
        }
        if (maxTime < 50) {
            maxTime = 10
        } else {
            maxTime = 30
        }
        for (let hero in heroSep) {
            if (heroSep[hero][1] >= maxTime && (heroSep[hero][0] < 0.47 || heroSep[hero][0] > 0.53)) {
                if (heroSep[hero][0] < 0.5) {
                    defM.push([hero, heroSep[hero][0], heroSep[hero][1]])
                } else {
                    winM.push([hero, heroSep[hero][0], heroSep[hero][1]])
                }
            }
        }
        defM = defM.sort((a, b) => a[1] - b[1]) // 被打败
        winM = winM.sort((a, b) => b[1] - a[1]) // 打败

        let rowNum = d3.max([defM.length, winM.length]),
            heightMax = d3.max([d3.max(defM, d => d[2]), d3.max(winM, d => d[2])]),
            boxGap = margin.left * 2,
            boxWidth = (width - borderWidth) / 2 - boxGap * 2,
            rowLimit = 15,
            rowMax = d3.min([rowLimit, rowNum]);

        let Wscale = d3.scaleLinear().domain([0, 1]).range([0, boxWidth]),
            Yscale = d3.scaleBand().domain([...Array(rowLimit).keys()]).range([0, height - boxGap - margin.bottom]).paddingInner(0.2),
            Hscale = d3.scaleLinear().domain([0, heightMax]).range([0, Yscale.bandwidth()]);

        if (winM.length > rowMax) {
            winM = winM.slice(0, rowMax)
        }
        if (defM.length > rowMax) {
            defM = defM.slice(0, rowMax)
        }
        relation_g.append('g').selectAll('.winMore_box')
            .data(winM)
            .enter()
            .append('rect')
            .attr('class', 'winMore_box')
            .attr('height', Yscale.bandwidth())
            .attr('width', boxWidth)
            .attr('transform', function(d, i) {
                return 'translate(' + boxGap * 2 + ',' + Yscale(i) + ')'
            })
            .style('fill', '#f2eee5')
            .style('opacity', 0.5)
            .style('stroke', '#a9a6a0')
            .style('stroke-width', 0.5)
        relation_g.append('g').selectAll('.winMore')
            .data(winM)
            .enter()
            .append('rect')
            .attr('class', 'winMore')
            .attr('height', function(d) {
                return Hscale(d[2])
            })
            .attr('width', function(d) {
                return Wscale(d[1])
            })
            .attr('transform', function(d, i) {
                return 'translate(' + ((width - borderWidth) / 2 - Wscale(d[1])) + ',' + (Yscale(i) + Yscale.bandwidth() / 2 - Hscale(d[2]) / 2) + ')'
            })
            .style('fill', '#3a9679')
            .style('opacity', 0.8)
        relation_g.append('g').selectAll('.winMore_text')
            .data(winM)
            .enter()
            .append('text')
            .attr('class', 'winMore_text')
            .text(function(d) {
                return String((Number(d[1]) * 100).toFixed(1)) + "%/" + d[2]
            })
            .style('font-size', 10)
            .style('fill', '#63686e')
            .attr('transform', (d, i) => 'translate(' + (boxGap * 2 + textTrans) + ',' + (Yscale(i) + Yscale.bandwidth() * 0.8) + ')')
        relation_g.append('g').selectAll('.winMore_img')
            .data(winM)
            .enter()
            .append('svg:image')
            .attr('class', 'winMore_img')
            .attr('xlink:href', d => 'static/img/Hero_Pic/' + d[0] + '.jpg')
            .attr('width', Yscale.bandwidth())
            .attr('height', Yscale.bandwidth())
            .attr('transform', function(d, i) {
                return 'translate(' + (boxGap * 2 - Yscale.bandwidth()) + ',' + Yscale(i) + ')'
            })



        relation_g.append('g').selectAll('.defMore_box')
            .data(defM)
            .enter()
            .append('rect')
            .attr('class', 'defMore_box')
            .attr('height', Yscale.bandwidth())
            .attr('width', boxWidth)
            .attr('transform', function(d, i) {
                return 'translate(' + (width / 2 + borderWidth / 2) + ',' + (Yscale(i) + Yscale.bandwidth() / 2) + ')'
            })
            .style('fill', '#f2eee5')
            .style('opacity', 0.5)
            .style('stroke', '#a9a6a0')
            .style('stroke-width', 0.5)
        relation_g.append('g').selectAll('.defMore')
            .data(defM)
            .enter()
            .append('rect')
            .attr('class', 'defMore')
            .attr('height', function(d) {
                return Hscale(d[2])
            })
            .attr('width', function(d) {
                return Wscale(d[1])
            })
            .attr('transform', function(d, i) {
                return 'translate(' + (width / 2 + borderWidth / 2) + ',' + (Yscale(i) + Yscale.bandwidth() / 2 + Yscale.bandwidth() / 2 - Hscale(d[2]) / 2) + ')'
            })
            .style('fill', '#e16262')
            .style('opacity', 0.8)
        relation_g.append('g').selectAll('.defMore_text')
            .data(defM)
            .enter()
            .append('text')
            .attr('class', 'defMore_text')
            .text(function(d) {
                return String((Number(d[1]) * 100).toFixed(1)) + "%/" + d[2]
            })
            .style('text-anchor', 'end')
            .style('font-size', 10)
            .style('fill', '#63686e')
            .attr('transform', (d, i) => 'translate(' + (width - boxGap * 2 - textTrans) + ',' + (Yscale(i) + Yscale.bandwidth() * 1.2) + ')')

        relation_g.append('g').selectAll('.defMore_img')
            .data(defM)
            .enter()
            .append('svg:image')
            .attr('class', 'defMore_img')
            .attr('xlink:href', d => 'static/img/Hero_Pic/' + d[0] + '.jpg')
            .attr('width', Yscale.bandwidth())
            .attr('height', Yscale.bandwidth())
            .attr('transform', function(d, i) {
                return 'translate(' + (width - boxGap * 2) + ',' + (Yscale(i) + Yscale.bandwidth() / 2) + ')'
            })

    })

}