library(metafor)
library(plotrix) #for ablineclip function
require(compute.es)

### to save as png file
#png(filename="rep.outcome.figure.png", res=95, width=1000, height=500, type="cairo")

dat <- read.csv(file = "rep-outcome-figure.csv", header = TRUE)
dat <- escalc(measure="COR", ri=dat$r, ni=dat$N, data=dat, slab=dat$study)
dat

### decrease margins so the full space is used
par(mar=c(4,4,1,2))
par(cex=1.25, font=1)

### set up forest plot (rows argument used to specify exactly in which rows outcomes will be plotted)
forest(dat$yi, dat$vi, xlim=c(-1.2,1.8), at=c(-.3,-.2,-.1,0,.1,.2,.3,.4,.5,.6,.7,.8,.9),
       cex=1.25, ylim=c(12, 23), rows=c(20.25, 19:14), annotate=FALSE, cex.axis=1,
       xlab="Effect size (r) [95% CI]", psize=1.25, pch=dat$study.symbol, steps=5)
op <- par(cex=1.25, font=3)

### smaller italicized font for "meta-analytice estimate text"
op <- par(cex=1, font=3)

### fit fixed-effects model (use slab argument to define study labels)
res <- rma(yi=dat$yi, vi=dat$vi, data=dat, measure="COR", subset=(dat$study.type=="replication"),
           slab=dat$study, method="FE")
### add summary estimate to the bottom
addpoly(res, row=12.5, cex=2, mlab="",efac=1.3, annotate = FALSE)
text(-1.09, 12.5, "Meta-analytic estimate of replications", pos=4)
### horizontal separation line
abline(h=13.25)

#original ES point estimate line
ablineclip(v=.5, y1=-2,y2=21, col="blue", lty="dashed", lwd=.5) 
op <- par(cex=.75, font=1)
text(.17, 21.25, "original effect size point estimate", col="blue", pos=4)
abline(h=19.65, lty="solid", lwd=.25)
op <- par(cex=1, font=1)
text(.9,19, "signal - consistent", pos=4)
text(.9,18, "signal - inconsistent, larger", pos=4)
text(.9,17, "signal - inconsistent, smaller", pos=4)
text(.9,16, "signal - inconsistent, opposite", pos=4)
text(.9,15, "no signal - consistent", pos=4)
text(.9,14, "no signal - inconsistent", pos=4)
op <- par(cex=1, font=3)
text(.9,21.25, "Replication outcome", pos=4)
#dev.off()


