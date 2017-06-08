
getWSSE <- function(df){
  # the df should only contain 1 dependent variable 
  
  nonFactor <- c("sbjId", "M")
  colNames <- colnames(df)
  idx <- match(colNames,nonFactor)
  factorCol <- which(is.na(idx))
  
  # need to spread these factor Columns into numbers to create unique condition id
  
  arg <- ""
  c   <- 0
  for(f in factorCol){
    df[[f]] <- as.character(df[[f]])
    c <- c+1
    arg[c] <- paste("df$",colNames[f],sep = "")
  }
  # arg : "df$half" "df$blockType" "df$trialType"
  
  cmd <- paste0("paste0(", paste(arg,collapse = ","),")") 
  df$name <-eval(parse(text=cmd))
  
  # if you run class(parse(text=cmd)) then you'll get "expression"
  

  # get rid off the factor columns and speard into the right format
  df2 <- df %>% 
    select(sbjId, M, name)
  df2 <- spread(df2,key = name,value = M)
  df2 <- df2 %>% 
    select(-sbjId)
  

  
  # calcaulate within-subject SE based on Franz & Loftus
  # df should be in sbj x condition format
  # one condition per column, one subject per row format
  
  NrS <- dim(df2)[1]
  NrCond <- dim(df2)[2]
  cnt <- 0
  SEM <- c(0)
  condList <- c(1:NrCond)
  
  for(i in condList){
   
    condList2 <- condList[which(condList!=i)]
    
    for(j in condList2){
     cnt <- cnt+1
     D <-  as.matrix(df2[,i]-df2[,j])
     SEM[cnt] <- sd(D)/sqrt(NrS-1)
    }
  }
  
  SEM_LnM <- mean(SEM)/sqrt(2)
  
  return(SEM_LnM)
}