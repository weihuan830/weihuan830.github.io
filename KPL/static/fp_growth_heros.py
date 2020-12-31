import os
import time
from tqdm import tqdm #进度条
import json
from collections import Counter 
import sys
sys.setrecursionlimit(100000)

def getSpecData(seasonRec, target, team_id):#根据路径加载数据集
	ans=[]#将数据保存到该数组
	setResult = []
	matchCode = []
	team_name =''

	for i in range(len(seasonRec)):

		if int(seasonRec[i]['team_id']) == int(team_id) and judgeInclude(target, seasonRec[i]):
			if seasonRec[i]['game_label'] not in matchCode:
				matchCode.append(seasonRec[i]['game_label'])
			
			team_name = seasonRec[i]['team_name']
			temp= getOppoHeros(seasonRec, seasonRec[i]['game_label'], seasonRec[i]['game_time'], seasonRec[i]['is_win'])
			if -1 in temp:
				print(seasonRec[i]['game_label'], seasonRec[i]['game_time'])

			temp=list(set(temp))#去重，排序
			temp.sort()
			ans.append(temp)#将处理好的数据添加到数组
			setResult.append([seasonRec[i]['is_win'], seasonRec[i]['camp']])
	return [ans, matchCode, team_id, team_name, setResult]

def getSpecData_o(seasonRec, target, team_id):#根据路径加载数据集
	ans=[]#将数据保存到该数组
	setResult = []
	matchCode = []
	team_name =''

	for i in range(len(seasonRec)):

		if judgeInclude(target, seasonRec[i]) and int(seasonRec[i]['team_id']) != int(team_id):
			if seasonRec[i]['game_label'] not in matchCode:
				matchCode.append(seasonRec[i]['game_label'])
			
			temp= getOppoHeros(seasonRec, seasonRec[i]['game_label'], seasonRec[i]['game_time'], seasonRec[i]['is_win'])
			if -1 in temp:
				print(seasonRec[i]['game_label'], seasonRec[i]['game_time'])

			temp=list(set(temp))#去重，排序
			temp.sort()
			ans.append(temp)#将处理好的数据添加到数组
			setResult.append([seasonRec[i]['is_win'], seasonRec[i]['camp']])
	return [ans, matchCode, team_id, team_name, setResult]

def judgeInclude(target, rec):
	for i in target:
		if i not in rec['pick_heros'].split('|'):
			return False
	return True

def getOppoHeros(allSet, tarLabel, tarTime, judgeFlag):
	for i in allSet:
		if tarLabel == i['game_label'] and judgeIFtime(tarTime, i['game_time']) and judgeFlag != i['is_win']:
			return i['pick_heros'].split('|')
	return [-1, tarLabel, tarTime]


def judgeIFtime(t1, t2):
	if t1.split(':')[0] == t2.split(':')[0] and (abs(int(t1.split(':')[1]) - int(t2.split(':')[1])) < 5):
		return True
	return False

def load_data_all(path):#根据路径加载数据集
	ans=[]#将数据保存到该数组
	setResult = []
	matchCode = []
	team_name =''
	with open(path) as jsonfile:
		workbook=json.load(jsonfile)
		for i in range(len(workbook)):
			if workbook[i]['game_label'] not in matchCode:
				matchCode.append(workbook[i]['game_label'])

			temp= workbook[i]['pick_heros'].split('|')
			temp=list(set(temp))#去重，排序
			temp.sort()
			ans.append(temp)#将处理好的数据添加到数组
			setResult.append([workbook[i]['is_win'], workbook[i]['camp']])

	return [ans, matchCode, "", "", setResult]

def save_rule(rule,path):#保存结果到txt文件
	with open(path,"w") as f:
		f.write("index  confidence"+"   rules\n")
		index=1
		for item in rule:
			s=" {:<4d}  {:.3f}        {}=>{}\n".format(index,item[2],str(list(item[0])),str(list(item[1])))
			index+=1
			f.write(s)
		f.close()
	print("result saved,path is:{}".format(path))

def save_data(num_rec, rule, save_path_json,team_id, team_name, targetGroup, typeFlag):
	sup_resp = []
	for setName in num_rec:
		if num_rec[setName][0] > 1:
			sup_resp.append([list(setName), num_rec[setName]])

	sup_resp = sorted(sup_resp, key=lambda x: x[1][1], reverse=True)
	
	rule_resp = []
	for rul in range(len(rule)):
		if rule[rul][3] > 1:
			rule_resp.append([list(rule[rul][0]), list(rule[rul][1]), rule[rul][2], rule[rul][3]])
	if typeFlag:
		with open(save_path_json + '/' + str(targetGroup[0]).replace('\'','') + '_o.json', 'w') as file:
			json.dump({'sup_resp': sup_resp, 'rule': rule_resp,'team_info':[team_id, team_name]}, file)
	else:
		with open(save_path_json + '/' + str(targetGroup[0]).replace('\'','') + '.json', 'w') as file:
			json.dump({'sup_resp': sup_resp, 'rule': rule_resp,'team_info':[team_id, team_name]}, file)

class Node:
	def __init__(self, node_name,count,parentNode):
		self.name = node_name
		self.count = count
		self.nodeLink = None#根据nideLink可以找到整棵树中所有nodename一样的节点
		self.parent = parentNode#父亲节点
		self.children = {}#子节点{节点名字:节点地址}

class Fp_growth():
	def update_header(self,node, targetNode):#更新headertable中的node节点形成的链表
		while node.nodeLink != None:
			node = node.nodeLink
		node.nodeLink = targetNode

	def update_fptree(self,items, node, headerTable):#用于更新fptree，（按次数排序的元素id列表，树头节点，{满足最小阈值的元素id:[出现次数，对应节点]}）
		if items[0] in node.children:
			# 判断items的第一个结点是否已作为子结点
			node.children[items[0]].count+=1
		else:
			# 创建新的分支
			node.children[items[0]] = Node(items[0],1,node) #生成items[0]子节点添加到node的children下
			# 更新相应频繁项集的链表，往后添加
			if headerTable[items[0]][1] == None:
				headerTable[items[0]][1] = node.children[items[0]]
			else:
				self.update_header(headerTable[items[0]][1], node.children[items[0]])
			# 递归
		if len(items) > 1:
			self.update_fptree(items[1:], node.children[items[0]], headerTable)

	def create_fptree(self,data_set, min_support,flag=False):#建树主函数
		'''
		根据data_set创建fp树
		header_table结构为
		{"nodename":[num,node],..} 根据node.nodelink可以找到整个树中的所有nodename
		'''
		item_count = {}#统计各项出现次数
		for t in data_set:#第一次遍历，得到频繁一项集
			for item in t:
				if item not in item_count:
					item_count[item]=1
				else:
					item_count[item]+=1
		headerTable={}
		for k in item_count:#剔除不满足最小支持度的项
			if item_count[k] >= min_support:
				headerTable[k]=item_count[k]
		
		freqItemSet = set(headerTable.keys())#满足最小支持度的频繁项集
		if len(freqItemSet) == 0:
			return None, None, None
		for k in headerTable:
			headerTable[k] = [headerTable[k], None] # element: [count, node]
		tree_header = Node('head node',1,None)
		if flag:
			ite=tqdm(data_set)
			# print(ite)
		else:
			ite=data_set
		for t in ite:#第二次遍历，建树
			# if len(t) > 4:
			# 	print(t)
			localD = {}
			for item in t:
				if item in freqItemSet: # 过滤，只取该样本中满足最小支持度的频繁项
					localD[item] = headerTable[item][0] # element : count
			if len(localD) > 0:
				# 根据全局频数从大到小对单样本排序
				order_item = [v[0] for v in sorted(localD.items(), key=lambda x:x[1], reverse=True)]
				# 用过滤且排序后的样本更新树
				self.update_fptree(order_item, tree_header, headerTable)
		return tree_header, headerTable, sorted(item_count.items(), key = lambda x: x[1], reverse=True)

	def find_path(self,node, nodepath):
		'''
		递归将node的父节点添加到路径
		'''
		if node.parent != None:
			nodepath.append(node.parent.name)
			self.find_path(node.parent, nodepath)

	def find_cond_pattern_base(self,node_name, headerTable):
		'''
		根据节点名字，找出所有条件模式基
		'''
		treeNode = headerTable[node_name][1]
		cond_pat_base = {}#保存所有条件模式基
		while treeNode != None:
			nodepath = []
			self.find_path(treeNode, nodepath)
			if len(nodepath) > 1:
				cond_pat_base[frozenset(nodepath[:-1])] = treeNode.count # 为什么要去掉第二层的节点？注：应是去掉起始节点
			treeNode = treeNode.nodeLink 
		# print(cond_pat_base)
		return cond_pat_base

	def create_cond_fptree(self,headerTable, min_support, temp, freq_items,support_data):
		# 最开始的频繁项集是headerTable中的各元素
		freqs = [v[0] for v in sorted(headerTable.items(), key=lambda p:p[1][0])] # 根据频繁项的总频次排序
		# print(freqs)
		for freq in freqs: # 对每个频繁项
			freq_set = temp.copy()
			freq_set.add(freq)
			freq_items.add(frozenset(freq_set))
			if frozenset(freq_set) not in support_data:#检查该频繁项是否在support_data中
				support_data[frozenset(freq_set)]=headerTable[freq][0]
			else:
				support_data[frozenset(freq_set)]+=headerTable[freq][0]

			cond_pat_base = self.find_cond_pattern_base(freq, headerTable)#寻找到所有条件模式基
			# print(cond_pat_base)
			cond_pat_dataset=[]#将条件模式基字典转化为数组
			for item in cond_pat_base:
				item_temp=list(item)
				item_temp = sorted(item_temp, key = lambda x: headerTable[x][0], reverse=True)
				# print(item_temp)
				for i in range(cond_pat_base[item]):
					cond_pat_dataset.append(item_temp)
			#创建条件模式树
			cond_tree, cur_headtable, hero_count = self.create_fptree(cond_pat_dataset, min_support)
			if cur_headtable != None:
				self.create_cond_fptree(cur_headtable, min_support, freq_set, freq_items,support_data) # 递归挖掘条件FP树

	def generate_L(self,data_set,min_support):
		freqItemSet=set()
		support_data={}
		tree_header,headerTable, hero_count=self.create_fptree(data_set,min_support,flag=True)#创建数据集的fptree
		# print(headerTable)
		#创建各频繁一项的fptree，并挖掘频繁项并保存支持度计数
		self.create_cond_fptree(headerTable, min_support, set(), freqItemSet,support_data)
		# print(support_data)
		
		max_l=0
		for i in freqItemSet:#将频繁项根据大小保存到指定的容器L中
			if len(i)>max_l:max_l=len(i)
		L=[set() for _ in range(max_l)]
		for i in freqItemSet:
			L[len(i)-1].add(i)
		for i in range(len(L)):
			print("frequent item {}:{}".format(i+1,len(L[i]))) 
		return L,support_data 

	def generate_R(self,data_set, min_support, min_conf):
		L,support_data=self.generate_L(data_set,min_support)
		rule_list = []
		sub_set_list = []
		# print(L)

		for i in range(0, len(L)):
			for freq_set in L[i]:
				for sub_set in sub_set_list:
					if sub_set.issubset(freq_set) and freq_set-sub_set in support_data:#and freq_set-sub_set in support_data
						conf = support_data[freq_set] / support_data[freq_set - sub_set]
						big_rule = (freq_set - sub_set, sub_set, conf, support_data[freq_set-sub_set])
						if conf >= min_conf and big_rule not in rule_list:
						    # print freq_set-sub_set, " => ", sub_set, "conf: ", conf
							rule_list.append(big_rule)
				sub_set_list.append(freq_set)
		rule_list = sorted(rule_list,key=lambda x:(x[2]),reverse=True)
		return rule_list, support_data

def getAttendTeam(season_id):
	temp = []

	with open(os.path.dirname(__file__) + '/rawData/season_'+ str(season_id) + '/' + str(season_id) + '_Team.json') as file:
		teamData = json.load(file)

	for i in teamData:
		temp.append(i['team_id'])

	return temp

def calculateWinRate(support_data, data_set):
	for group in support_data:
		groupSet = []
		for setIndex in range(len(data_set[0])):
			satFlag = 1
			for id in list(group):
				if(id not in data_set[0][setIndex]):
					satFlag = 0
					break
			
			if satFlag:
				groupSet.append(data_set[4][setIndex][0])

		support_data[group] = [support_data[group], Counter(groupSet)['1']/support_data[group]]








if __name__=="__main__":

	season_id = 32
	thresholdNum = [4,3,2,1,1]

	team_resp = getAttendTeam(season_id)
	# team_resp = [44]

	rawData_path = os.path.dirname(__file__) + '/rawData/season_' + str(season_id) + '/' + str(season_id) + '_Team/'

	for team_id in team_resp:
		if not os.path.exists(rawData_path + str(team_id)):
			os.makedirs(rawData_path + str(team_id))
		save_path_json = rawData_path + str(team_id)

		file_name = str(season_id) + '_' + str(team_id) + '_fpgrowth.json'
		with open(rawData_path + file_name) as jsonfile:
			with open(os.path.dirname(__file__) + '/rawData/season_' + str(season_id) + '/' + str(season_id) + '_Set.json') as wholefile:
				workbook=json.load(jsonfile)
				wholeSeason = json.load(wholefile)

				min_support = 1
				min_conf=0.60#最小置信度
				fp=Fp_growth()

				for group in workbook['sup_resp']:
					for rec in workbook['sup_resp'][group]:
						if rec[1][0] > thresholdNum[int(group) - 1]:

							data_set = getSpecData(wholeSeason, rec[0], team_id)
							data_set_o = getSpecData_o(wholeSeason, rec[0], team_id)



							rule_list, support_data = fp.generate_R(data_set[0], min_support, min_conf)
							if data_set_o[0] != []:
								rule_list_o, support_data_o = fp.generate_R(data_set_o[0], min_support, min_conf)
								calculateWinRate(support_data_o, data_set_o)
							else:
								rule_list_o = []
								support_data_o = []

							calculateWinRate(support_data, data_set)
							

							save_data(support_data_o, rule_list_o, save_path_json, data_set_o[2], data_set_o[3], rec, 1)
							save_data(support_data, rule_list, save_path_json, data_set[2], data_set[3], rec, 0)

	# store whole set statistics
	# save_path_json= 'DrawAnalytics/'+ str(season_id)+'_Team/'+str(season_id)+"_Set_fpgrowth.json"

	# data_set=load_data_all(rawData_path)

	# fp=Fp_growth()
	# rule_list, support_data = fp.generate_R(data_set[0], min_support, min_conf)

	# support_data_cal = calculateWinRate(support_data, data_set)
	# save_data(support_data, rule_list, save_path_json, data_set[2], data_set[3])


