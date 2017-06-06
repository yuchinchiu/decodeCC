################################
# This file performs some preliminary analysis
# load gpData_v1.Rda (gpM1-gpM3, workerIdList)
# 
################################
rm(list=ls())
library(tidyverse) 
currentDir <-  getwd()
setwd(currentDir)
load("gpData_v1.Rda")

catVblList <- c("stimCat", "trialType", "blockType", "memCond", "swProb", "task")

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

gpBasic <- tibble(sbjId = numeric(0), CSPC = numeric(0), ISSP = numeric(0), memHit = numeric(0), 
                  memFA = numeric(0), p1ACC = numeric(0), p2ACC = numeric(0))
gpCondM1 <- tibble()
gpCondM2 <- tibble()
gpCondM3 <- tibble()
gpMemRespCNT <- tibble()




for (S in 1:length(workerIdList)){
  
  # Phase 1, blockType = 0/1 (mostlyC, mostlyIC), trial type = 0/1 (Congruent, Incongruent)
  
  mydata <- gpM1 %>% filter(sbjId==S)
  condM <- mydata %>%
    filter(sbjRT > 200, sbjRT <=1000) %>%
    group_by(blockType, trialType) %>%
    summarise(meanRT = mean(sbjRT, na.rm = TRUE), meanACC = mean(sbjACC))
  condM <- bind_cols(tibble(sbjId=rep(S,dim(condM)[1])), condM)
  gpCondM1 <- bind_rows(gpCondM1, condM)
  
  CSPC <- condM[[2,"meanRT"]]-condM[[1,"meanRT"]]-(condM[[4,"meanRT"]]-condM[[3,"meanRT"]])
  p1ACC <- mean(mydata$sbjACC)
  
  # Phase2, swProb = 20/80 (mostly repeat, mostly switch), trial type = 0/1 (repeat, switch)
  rm(mydata, condM)
  mydata <- gpM2 %>% filter(sbjId == S)
  condM <- mydata %>%
    slice(40:n()) %>%
    filter(sbjRT > 200, sbjRT <= 1000) %>%
    group_by(swProb, trialType) %>%
    summarise(meanRT = mean(sbjRT, na.rm = TRUE), meanACC = mean(sbjACC))
  condM <- bind_cols(tibble(sbjId = rep(S,dim(condM)[1])), condM)
  gpCondM2 <- bind_rows(gpCondM2, condM)
  
  ISSP <- condM[[2,"meanRT"]]-condM[[1,"meanRT"]]-(condM[[4,"meanRT"]]-condM[[3,"meanRT"]])
  p2ACC <- mean(mydata$sbjACC)
  
  # Phase 3, memory recognition, memCond 1:5 = MC-C, MC-IC, MIC-C, MIC-IC, NEW
  # response: 0/1 = NEW/OLD
  # sbjResp: 1=new, 4=old
  rm(mydata, condM)
  mydata <- gpM3 %>% filter(sbjId==S)
  mydata[which(mydata$sbjResp ==3|mydata$sbjResp ==4), "sbjmemYN"] <- 1 # prob old, def old
  mydata[which(mydata$sbjResp ==1|mydata$sbjResp ==2), "sbjmemYN"] <- 0 # def new, prob new
  
  # calculate memory acc
  mydata$sbjACC <- 0
  mydata[which(mydata$sbjmemYN == mydata$response), "sbjACC"] <- 1
  condM <- mydata %>%
    filter(blockType!=99) %>%
    group_by(blockType, trialType) %>%
    summarise(meanACC = mean(sbjACC), meanRT = mean(sbjRT, na.rm = TRUE)) 

  condM <- bind_cols(tibble(sbjId = rep(S,dim(condM)[1])), condM)
  gpCondM3 <- bind_rows(gpCondM3, condM)
  
  memRespCNT <- mydata %>%
    filter(sbjResp <= 4 & sbjResp >= 1) %>%
    group_by(response, sbjResp) %>%
    summarise(cnt = n())
  tt <- tibble(response=c(rep(0,4), rep(1,4)), sbjResp=c(1,2,3,4,1,2,3,4)) # to fill in some NA if a sbj doesn't have all 1-4
  memRespCNT <- right_join(memRespCNT, tt)
  memRespCNT <- bind_cols(tibble(sbjId = rep(S,dim(memRespCNT)[1])), memRespCNT)
  gpMemRespCNT <- bind_rows(gpMemRespCNT, memRespCNT)
  

  
  memP <- mydata %>%
    group_by(response) %>% # response ==1, get HitRate, response==0, get correct Rejection
    summarise(meanRate = mean(sbjACC)) 
  
  # FA = 1-CR
  
  gpBasic[S,] <- c(S, CSPC, ISSP, memP[[2,"meanRate"]], 1-memP[[1, "meanRate"]], p1ACC*100, p2ACC*100)
  
  rm(mydata, condM)
  
}



setwd(currentDir)
save(gpCondM1, gpCondM2, gpCondM3, gpBasic, gpMemRespCNT, file = "gpData_summary.Rda")


