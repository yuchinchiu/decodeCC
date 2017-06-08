################################
# This file performs some plotting
# load gpData_summary.Rda (gpCondM1-gpCondM3, gpBasic, gpMemRespCNT)
# This file uses my own function getWSSE (get within-subject SEM) to get the correct within-S SEM for plotting

###################################################
rm(list=ls())
library(tidyverse) 
source("getWSSE.R")

currentDir <-  getwd()
setwd(currentDir)
load("step2_CondMs.Rda")
NrS <-  dim(gpBasic)[1]


########### Stroop Task (CSPC) ####################
df <- gpCondM1 %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM1 %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

CSPC <- gpCondM1 %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt , gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 




############# Task-switching (ISSP) ################
df <- gpCondM2 %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM2 %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

ISSP <- gpCondM2 %>%
  group_by(swProb, trialType) %>%
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 



############# Recognition Memory ########################
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
  group_by(half, blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt , gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 


############# Task-switching (ISSP) by halves ################
df <- gpCondM2_half %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM2_half %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)

ISSP_half <- gpCondM2_half %>%
  group_by(half, swProb, trialType) %>%
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 



############# Recognition Memory by halves #####################
df <- gpCondM3_half %>% select(-meanACC)
colnames(df)[colnames(df)=="meanRT"] <- "M"
LnMSE_rt <- getWSSE(df)

df <- gpCondM3_half %>% select(-meanRT)
colnames(df)[colnames(df)=="meanACC"] <- "M"
LnMSE_acc <- getWSSE(df)


recogM_half <- gpCondM3_half %>%
  group_by(half, blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE_rt = LnMSE_rt, gpmeanACC = mean(meanACC)*100, SE_acc = LnMSE_acc*100) 

############# Correlation between CSPC and ISPC #####################
CSPCvsISSP <- cor.test(gpBasic$ISSP, gpBasic$CSPC)
CSPCvsISSP$p.value


gpCondM1_half$name <- paste0(gpCondM1_half$half, gpCondM1_half$blockType, gpCondM1_half$trialType)
gpCondM1_half <- gpCondM1_half %>% select(-half:-trialType, -meanACC)
gpCondM1_half <- spread(gpCondM1_half,key = name, value = meanRT)
cspc_1 <- (gpCondM1_half$`101`-gpCondM1_half$`100`)-(gpCondM1_half$`111`-gpCondM1_half$`110`)
cspc_2 <- (gpCondM1_half$`201`-gpCondM1_half$`200`)-(gpCondM1_half$`211`-gpCondM1_half$`210`)

gpCondM2_half$name <- paste0(gpCondM2_half$half, gpCondM2_half$swProb, gpCondM2_half$trialType)
gpCondM2_half <- gpCondM2_half %>% select(-half:-trialType, -meanACC)
gpCondM2_half <- spread(gpCondM2_half,key = name, value = meanRT)
issp_1 <- (gpCondM2_half$`1201`-gpCondM2_half$`1200`)-(gpCondM2_half$`1801`-gpCondM2_half$`1800`)
issp_2 <- (gpCondM2_half$`2201`-gpCondM2_half$`2200`)-(gpCondM2_half$`2801`-gpCondM2_half$`2800`)


CSPCvsISSP_1 <- cor.test(issp_1, cspc_1)
CSPCvsISSP_1$p.value

CSPCvsISSP_2 <- cor.test(issp_2, cspc_2)
CSPCvsISSP_2$p.value


gpBasic$cspc1 <- cspc_1
gpBasic$cspc2 <- cspc_2
gpBasic$issp1 <- issp_1
gpBasic$issp2 <- issp_2


setwd(currentDir)
save(CSPC, CSPC_half, ISSP, ISSP_half, recogM, recogM_half, gpBasic, file = "step3_gpSummary.Rda")


