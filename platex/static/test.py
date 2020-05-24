import os
import json
from PIL import Image
imglist = os.listdir("image")
with open("json/data.json", "w+") as f:
    data = []
    for item in imglist:
        if not "Store" in item:
            img = Image.open('./image/' + item)
            sztxt = ""
            sz = img.size[0]/float(img.size[1])
            if img.size[1] > 500 and img.size[0] > 500:
                sztxt = "2x2"
            else:
                if sz >= 1.5:
                    sztxt = "2x1"
                elif sz <= 0.7:
                    sztxt = "1x2"
                else:
                    sztxt = "1x1"
            data.append({"name": item, "size":sztxt})
    json.dump({"data": data},f)



# basewidth = 300
# img = Image.open('./image/3de373097a0d1b01086e7e794a466beff2293d66.png')
# wpercent = (basewidth/float(img.size[0]))
# hsize = int((float(img.size[1])*float(wpercent)))
# img = img.resize((basewidth,hsize), Image.ANTIALIAS)
# img.save('image.png') 
# print(img.size)