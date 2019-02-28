library(metafor)
library(plotrix) #for ablineclip function
require(compute.es)

### to save as png file
png(filename="meta-analyze.figure.png", res=95, width=900, height=650, type="cairo")

dat <- read.csv(file = "z&l-reps-modified.csv", header = TRUE)
dat <- escalc(measure="COR", ri=dat$r, ni=dat$N, data=dat, slab=dat$study)
dat

### decrease margins so the full space is used
par(mar=c(4,4,1,2))
par(cex=1.1, font=1)

### set up forest plot (rows argument used to specify exactly in which rows outcomes will be plotted)
forest(dat$yi, dat$vi, xlim=c(-1.2,.8), at=c(-.3,-.2,-.1,0,.1,.2,.3,.4,.5,.6,.7,.8),
       cex=1, ylim=c(0, 23), rows=c(19:13, 6.5:3.5), annotate=FALSE, cex.axis=1,
       xlab="Effect size (r) [95% CI]", psize=1.25, pch=dat$study.symbol, steps=5)
op <- par(cex=1.1, font=3)
text(-1.21, 21.5, "Studies and Replications",    pos=4)
text( .45, 21.5, "Effect sizes (r) [95% CI]",  pos=2)

### random-effects model to quantify heterogeneity (use slab argument to define study labels)
res <- rma(yi=dat$yi, vi=dat$vi, data=dat, measure="COR", subset=(dat$study.info=="replication1"),
           slab=dat$study)
### add summary estimate to the bottom
addpoly(res, row=11.5, cex=2, mlab="",efac=1.2, annotate = FALSE)
### horizontal separation line
#abline(h=12.35,col = "darkgray", lty = 3)
### smaller italicized font for "meta-analytice estimate text"
op <- par(cex=.9, font=3)
text(-1.135, 11.5, "Meta-analytic estimate of operationalization #1 replications", pos=4)
op <- par(cex=.9, font=1)
text(-1.135, 10.5, "I^2 (total heterogeneity / total variability): .00%", pos=4, col="darkgrey")
text(-1.135, 9.5, "Test for Heterogeneity: Q(df = 5) = 1.93, p = .86", pos=4, col="darkgrey")
op <- par(cex=.9, font=1)
text(-1.2, 20.20, "Operationalization #1: Moral purity threat (transcribe text) boosts need to cleanse oneself (cleaning products desirability)", pos=4, col="darkgrey")

### horizontal separation line
abline(h=8.5,col = "darkgray" )

### random-effects model to quantify heterogeneity (use slab argument to define study labels)
res <- rma(yi=dat$yi, vi=dat$vi, data=dat, measure="COR", subset=(dat$study.info=="replication3"),
           slab=dat$study)
### add summary estimate to the bottom
addpoly(res, row=2, cex=2, mlab="", efac=1, annotate = FALSE)
### horizontal separation line
#abline(h=12.35,col = "darkgray", lty = 3)
### smaller italicized font for "meta-analytice estimate text"
op <- par(cex=.9, font=3)
text(-1.135, 2, "Meta-analytic estimate of generalization #1 replications", pos=4)
op <- par(cex=.9, font=1)
text(-1.135, 1, "I^2 (total heterogeneity / total variability): 53.7%", pos=4, col="darkgrey")
text(-1.135, 0, "Test for Heterogeneity: Q(df = 2) = 4.36, p = .11", pos=4, col="darkgrey")
op <- par(cex=.9, font=1)
text(-1.2, 7.75, "Generalization #1: Moral purity threat (recall [un]ethical act) boosts need to cleanse oneself (product choice)", pos=4, col="darkgrey")



dev.off()


#original ES point estimate line
#ablineclip(v=.5, y1=-2,y2=21, col="blue", lty="dashed", lwd=.5) 
#op <- par(cex=.75, font=1)
#text(.17, 21.25, "original effect size point estimate", col="blue", pos=4)
