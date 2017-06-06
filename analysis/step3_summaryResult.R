################################
# This file performs some plotting
# load gpData_summary.Rda (gpCondM1-gpCondM3, gpBasic, gpMemRespCNT)
# 
################################
rm(list=ls())
library(tidyverse) 
currentDir <-  getwd()
setwd(currentDir)
load("gpData_summary.Rda")
NrS <-  dim(gpBasic)[1]

# plot the 2 x 2 CSPC [mean + 1 SE]

# apathem is on white background, with black axis lines, no grids
# the default is theme_gray() with white grid lines, gray background
apatheme = theme_bw()+
  theme(panel.grid.major = element_blank(),
        panel.grid.minor = element_blank(),
        panel.border = element_blank(),
        axis.line=element_line())

dodge = position_dodge(width=0.9)

CSPC <- gpCondM1 %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanRT = mean(meanRT), SE = sd(meanRT)/sqrt(n())) %>%
  ggplot(aes(x = blockType, y = gpmeanRT, fill = trialType))  +
  geom_bar(stat ='identity', position = dodge) + 
  geom_errorbar(aes(ymax = gpmeanRT + (1*SE), ymin = gpmeanRT - (1*SE)), position = dodge, width = .25) + 
  #apatheme + 
  ylab("mean RT") +
  coord_cartesian(ylim=c(550,700)) +
  scale_fill_grey()


recogM <- gpCondM3 %>%
  group_by(blockType, trialType) %>% 
  summarise(gpmeanACC = mean(meanACC)*100, SE = sd(meanACC)/sqrt(n())*100) %>%
  ggplot(aes(x = blockType, y = gpmeanACC, fill = trialType))  +
  geom_bar(stat ='identity', position = dodge) + 
  geom_errorbar(aes(ymax = gpmeanACC + (1*SE), ymin = gpmeanACC - (1*SE)), position = dodge, width = .25) + 
  #apatheme + 
  ylab("mean ACC") +
  coord_cartesian(ylim=c(45,80)) +
  scale_fill_grey()