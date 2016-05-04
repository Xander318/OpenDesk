from sklearn.tree import DecisionTreeRegressor
import numpy as np
import logging
import zerorpc
import pandas as pds

class OpenDeskRPC(object):
    def predict(self, xData, yData, PredTime):
    	#Our model: takes in xData and yData (time, occ)
        logging.basicConfig()
        x = np.atleast_2d(xData).T
        y = yData
        clf=DecisionTreeRegressor()
        clf.fit(x,y)
        PredValue = clf.predict(PredTime)
        return (PredValue[0]*100) #And predicts output for predTime

#Sets this script up to run over ZeroRPC
#For communication with Node.js app
s = zerorpc.Server(OpenDeskRPC())
s.bind("tcp://0.0.0.0:4242")
s.run()
