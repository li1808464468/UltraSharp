# -*- coding: utf-8 -*-
# 这是注释

import xlrd
import warnings
import sys
from collections import OrderedDict
import json
import codecs
import os

reload(sys)
sys.setdefaultencoding('utf8')
 
warnings.filterwarnings("ignore")
 
def excel2json(excelPath, jsonPath, fileName):
    wb = xlrd.open_workbook('{excelPath}{fileName}.xlsx'.format(excelPath=excelPath, fileName=fileName))
    
    convert_list = []

    for sheetNo in range(0, len(wb.sheets())):

        sheetName = wb.sheet_by_index(sheetNo).name
        sh = wb.sheet_by_index(sheetNo)
        title = sh.row_values(0)

        for rownum in range(1, sh.nrows):
            rowvalue = sh.row_values(rownum)
            single = OrderedDict()
            for colnum in range(0, len(rowvalue)):
                single[title[colnum]] = rowvalue[colnum]
            convert_list.append(single)
 
        j = json.dumps(convert_list)
 
        with codecs.open('{fileName}.json'.format(fileName=fileName), "w", "utf-8") as f:
            f.write(j)
 
# Batch Test
excelPath = os.path.abspath('.')
jsonPath = os.path.abspath('.')


file_list = []

def getFileName(path):
	f_list = os.listdir(path)
	for x in f_list:
		if os.path.splitext(x)[1] == '.xlsx':
			file_list.append(os.path.splitext(x)[0])

getFileName(excelPath)

for x in file_list:
	fileName = x
	excel2json(excelPath + '/', jsonPath, fileName)














