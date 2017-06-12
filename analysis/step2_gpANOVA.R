################################
# This file performs group stats - repeated measure ANOVA 
# load gpData_v1.Rda (gpM1-gpM3, workerIdList)
# 
################################

rm(list=ls())
library(tidyverse) 
library(ez)  # ezANOVA
currentDir <-  getwd()
setwd(currentDir)
load("step1_allData_v1.Rda")

catVblList <- c("stimCat", "trialType", "blockType", "memCond", "swProb", "task","half", "sbjId")

# turn a bunch of 1/0 codings into categorical factors
idx <- match(catVblList,colnames(gpM1))
for (c in idx[!is.na(idx)]){
  gpM1[[c]]  <- factor(gpM1[[c]], ordered = TRUE)
} 

idx <- match(catVblList,colnames(gpM2))
for (c in idx[!is.na(idx)]){
  gpM2[[c]]  <- factor(gpM2[[c]], ordered = TRUE)
}

idx <- match(catVblList,colnames(gpM3))
for (c in idx[!is.na(idx)]){
  gpM3[[c]]  <- factor(gpM3[[c]], ordered = TRUE)
}



## Stroop Task : Repeated measure ANOVA 2 blockType x 2 trialType 

gpM1$validRT <- 1
gpM1[which(gpM1$sbjACC==0) ,"validRT"] <- 0
gpM1[which(gpM1$sbjRT<200) ,"validRT"] <- 0
gpM1[which(gpM1$sbjRT>1000),"validRT"] <- 0
ezPrecis(gpM1)
levels(gpM1$trialType) <- c("Congruent", "Incongruent")
levels(gpM1$blockType) <- c("Rarely InCongruent", "Freq. InCongruent")

# Stroop: RT
rt_anova = ezANOVA(data = gpM1[gpM1$validRT==1,]
                   , dv = sbjRT
                   , wid = .(sbjId)
                   , within = .(blockType, trialType)
                   )

print(rt_anova)

# Stroop: ACC
acc_anova = ezANOVA(data = gpM1
                   , dv = sbjACC
                   , wid = .(sbjId)
                   , within = .(blockType, trialType)
)

print(acc_anova)


# descriptive stats M, SD and FLSD (this is not within-subject SE...)
rt_CondMeans  = ezStats(data = gpM1[gpM1$validRT==1,]
        , dv = sbjRT
        , wid = .(sbjId)
        , within = .(blockType, trialType)
)
print(rt_CondMeans)


# Plotting 
stroop = ezPlot(
  data = list(gpM1[gpM1$validRT==1,], gpM1)
  , dv =  .(sbjRT, sbjACC)
  , wid = sbjId
  , within = .(blockType, trialType)
  , x = blockType
  , split = trialType
  , x_lab = 'BlockType'
  , split_lab = 'TrialType'
  , dv_labs = c('stroop RT(ms)', 'stroop ACC(%)')
  , y_free = TRUE
  
)
print(stroop)



## Memory Recognition Task : Repeated measure ANOVA 2 blockType x 2 trialType 

ezPrecis(gpM3)
# blockType, trialType includes 'new'... need to clean up here
memData <- gpM3[gpM3$memCond<=4,]  # new =5
memData$blockType <- factor(memData$blockType)
memData$trialType <- factor(memData$trialType)
levels(memData$trialType) <- c("Congruent", "Incongruent")
levels(memData$blockType) <- c("Rarely InCongruent", "Freq. InCongruent")


# memory: ACC
memACC_anova = ezANOVA(data = memData
                    , dv = sbjACC
                    , wid = .(sbjId)
                    , within = .(blockType, trialType)
)

print(memACC_anova)

# descriptive stats M, SD and FLSD (this is not within-subject SE...)
mem_CondMeans  = ezStats(data = memData
                        , dv = sbjACC
                        , wid = .(sbjId)
                        , within = .(blockType, trialType)
)
print(mem_CondMeans)

# Plotting 
memory = ezPlot(
  data = list(memData, memData[!is.na(memData$sbjRT),])
  , dv =  .(sbjACC, sbjRT)
  , wid = sbjId
  , within = .(blockType, trialType)
  , x = blockType
  , split = trialType
  , x_lab = 'BlockType'
  , split_lab = 'TrialType'
  , dv_labs = c('memory ACC(%)', 'memory RT(ms)')
  , y_free = TRUE
  
)
print(memory)



