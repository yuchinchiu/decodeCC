### practice some fancy plots 
rm(list=ls())
library(tidyverse) 
source("getWSSE.R")

currentDir <-  getwd()
setwd(currentDir)
load("step2_CondMs.Rda")
dodge = position_dodge(width=0.9)

levels(gpCondM1$blockType) <- c("Congruent", "Incongruent")
levels(gpCondM1$trialType) <- c("Congruent", "Incongruent")


## boxplot .. give the original full data.. boxplot will figure out the median, QR, outliers et
gpCondM1 %>% ggplot(aes(x = blockType, y = meanRT, fill = trialType)) + 
  geom_boxplot(position = dodge) +
  coord_cartesian(ylim=c(450,850))



### violin plot 
gpCondM1  %>% ggplot(aes(x = blockType, y = meanRT, fill = trialType)) + 
  # scale their size to the number of observations in each.. all with NrS = 14 here though
  geom_violin(scale = 'count', position = dodge) +
  #overlay boxplots over each violin, color them black, and whiskers grey, and notch them at median
  geom_boxplot(position = dodge, width = .12, color = 'grey40') +
  #add a 'point' representing the mean, and color it white
  stat_summary(fun.y='mean', geom = 'point', shape = 20, color='white')+
  #label your axes with full titles
  labs(x='Block Type', y='meanRT (Stroop)')+
  theme_classic()+
  coord_cartesian(ylim=c(450,850))


# 
# 
# vp.fancy=ggplot(dat, aes(x=security, y=jealousy))+
#   #add violins, but scale their size to the number of observations in each,
#   #and fill them in color based on security condition
#   geom_violin(scale='count',aes(fill=security))+
#   #overlay boxplots over each violin, color them black, and whiskers grey, and notch them at median
#   geom_boxplot(width=.12, fill=I('black'), notch=T, col='grey40')+
#   #add a 'point' representing the mean, and color it white
#   stat_summary(fun.y='mean', geom='point', shape=20, col='white')+
#   #label your axes with full titles
#   labs(x='Priming Condition', y='Jealousy Rating')+
#   #the next line controls the coloring/styling--this is a pre-programmed pallete
#   theme_classic()+
#   #remove the redunant legend since we already have condition mapped to x
#   theme(legend.position='none')

#go see https://sakaluk.wordpress.com/2015/04/13/2-the-ggplot2-package-your-gateway-drug-to-becoming-an-r-user/



### pirated plot 
CSPC <- gpCondM1 %>%
  group_by(blockType) %>%
  summarise(gpM = mean(meanRT), se = sd(meanRT)/sqrt(n()))

p1 = ggplot(data = CSPC, aes(x = blockType, y = gpM)) + 
  geom_violin(data = gpCondM1, aes(x = blockType, y = meanRT)) + 
  geom_jitter(data = gpCondM1, aes(x = blockType, y = meanRT), shape =1, width =.1) + 
  geom_point(size =3) + 
  geom_errorbar(ymax = gpM + se, ymin = gpM-se, width =.25) 
  
