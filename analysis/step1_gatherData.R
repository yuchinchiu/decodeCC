################################
# This file extract data from the log files (Mturk) and saved as a group tibble
# It outputs a gpData_v1.Rda in the same folder as the analysis script
# The file contains gpM1-gpM3, workerIdList
################################

rm(list=ls())
library(tidyverse)
currentDir <-  getwd()
dataDir    <- "X:/public_html/decodeCC_v1/data/v1_batches"
setwd(dataDir)


fileList <- list.files(path = dataDir, pattern = "*.log")
expColNames <- c("runId", "phase", "stim", "stimCat", "trialType", "blockType", "miniBlock", 
                 "memCond","response", "sbjResp", "sbjACC", "sbjRT", "catachTrial")

workerIdList <- c("")
SCNT <- 0
gpM1 <- tibble()
gpM2 <- tibble()
gpM3 <- tibble()

for (i in 1:length(fileList)){
  
  mydata <- as.matrix(read_csv(fileList[i], col_names = FALSE, col_types = cols(.default = col_integer())))
  mydata <- matrix(mydata, byrow = FALSE, ncol = length(expColNames))
  mydata <- as.tibble(mydata)
  
  colnames(mydata) <- expColNames
  mydata$runId <- mydata$runId +1
  mydata$catachTrial <- NULL
  mydata$half <- 0
  
  # get rid off the practice block for the filler task
  mydata <- mydata %>% filter(runId!=3)
  
  
  # separate Stroop task into 2 halves
  mydata[which(mydata$miniBlock<=8),"half"] <- 1
  mydata[which(mydata$miniBlock>8 & mydata$miniBlock<=16),"half"] <- 2
  
  # separate Stroop task into 2 halves
  mydata[mydata$runId==4,"half"] <- 1
  mydata[mydata$runId==5,"half"] <- 2
  
  # fill in corresponding halves for each stimulus in the memory task
  stimList <- as.matrix(mydata[mydata$phase==1,"stim"])
  for (ss in 1:length(stimList)){
    stimId <-  stimList[ss]
    h <- mydata[mydata$phase==1 & mydata$stim==stimId,"half"]
    mydata[mydata$phase==3 & mydata$stim==stimId,"half"] <- h
    
  }
  mydata$phase <- NULL
  
  
  
  # sepearte 3 phases of data into different data tibbles
  # runId ==3 is a practice run for the ISSP task
  p1Data <- mydata %>% filter(runId <=2)
  p2Data <- mydata %>% filter(runId ==4|runId ==5)
  p3Data <- mydata %>% filter(runId >=6)
  
  colnames(p2Data)[colnames(p2Data)=="blockType"] <- "task"
  colnames(p2Data)[colnames(p2Data)=="stimCat"] <- "swProb"
  p2Data$miniBlock <- NULL
  p2Data$memCond   <- NULL
  
  p3Data$miniBlock <- NULL
  p3Data[which(p3Data$memCond==1),"blockType"] <- 0
  p3Data[which(p3Data$memCond==2),"blockType"] <- 0
  p3Data[which(p3Data$memCond==3),"blockType"] <- 1
  p3Data[which(p3Data$memCond==4),"blockType"] <- 1
  
  p3Data[which(p3Data$memCond==1),"trialType"] <- 0
  p3Data[which(p3Data$memCond==2),"trialType"] <- 1
  p3Data[which(p3Data$memCond==3),"trialType"] <- 0
  p3Data[which(p3Data$memCond==4),"trialType"] <- 1

  p1ACC <- mean(p1Data$sbjACC, na.rm = TRUE)*100
  p2ACC <- mean(p2Data$sbjACC, na.rm = TRUE)*100
  
  if (p1ACC >=65 & p2ACC >=65){
    SCNT <- SCNT +1
    p1Data$sbjId <- SCNT
    p2Data$sbjId <- SCNT
    p3Data$sbjId <- SCNT
    
    gpM1 <- bind_rows(gpM1, p1Data)
    gpM2 <- bind_rows(gpM2, p2Data)
    gpM3 <- bind_rows(gpM3, p3Data)

  # figure out the corresponding sbjId  
  fileNameTemp <- strsplit(fileList[i], "\\.")
  logFileName  <- fileNameTemp[[1]][1]
  fileList2 <- list.files(dataDir, pattern = paste(logFileName, ".txt", sep = ""))
  batchInfo <- read_delim(fileList2, delim = ":", col_names = FALSE, col_types = cols(.default = col_character()))
  workerIdList[SCNT] <- batchInfo[which(batchInfo[,1]=="workerId"),2]
  
  }
}

setwd(currentDir)
save(gpM1, gpM2, gpM3, workerIdList, file = "step1_allData_v1.Rda")