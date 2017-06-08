################################
# This file performs some plotting
# load gpData_summary.Rda (gpCondM1-gpCondM3, gpBasic, gpMemRespCNT)
# This file uses my own function getWSSE (get within-subject SEM) to get the correct within-S SEM for plotting

################################
rm(list=ls())
library(tidyverse) 
source("getWSSE.R")

currentDir <-  getwd()
setwd(currentDir)
load("step2_CondMs.Rda")
NrS <-  dim(gpBasic)[1]


############# Stroop Task (CSPC) ################
df <- gpCondM1 %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM1 %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

CSPC <- gpCondM1 %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt , gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 




############# Task-switching ################
df <- gpCondM2 %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM2 %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

ISSP <- gpCondM2 %>%
  group_by(swProb, trialType) %>%
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 



############# Recognition Memory ################
df <- gpCondM3 %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM3 %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)


recogM <- gpCondM3 %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 
  


############# Stroop Task (CSPC) by halves ################
df <- gpCondM1_half %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM1_half %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

CSPC_half <- gpCondM1_half %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt , gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 


############# Task-switching (ISSP) by halves ################
df <- gpCondM2_half %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM2_half %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

ISSP_half <- gpCondM2_half %>%
  group_by(swProb, trialType) %>%
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 



############# Recognition Memory by halves ################
df <- gpCondM3_half %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM3_half %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)


recogM_half <- gpCondM3_half %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 


setwd(currentDir)
save(CSPC, CSPC_half, ISSP, ISSP_half, recogM, recogM_half, file = "step3_gpSummary.Rda")


