# Ebola Sources

## Ebola Deaths

### WHO (World Health Organization)

> http://apps.who.int/gho/data/view.ebola-sitrep.ebola-summary-latest?lang=en

WHO dataset on Ebola deaths topic is the source data of 
almost all other data presentation available on the web 
(e.g. [Ebola Data](https://who-ocr.github.io/ebola-data/) or 
[CDC](http://www.cdc.gov/vhf/ebola/outbreaks/2014-west-africa/index.html)).

#### Structure

Ebola Data and Statistics section provide almost daily reports (from 12.10.2014 to today) with the following data:
- Suspected Cases
- Probable Cases
- Confirmed Cases
- Total Cases
- Suspected Deaths
- Probable Deaths
- Confirmed Deaths
- Total Deaths

All data is broken down by countries (Guinea, Liberia, Sierra Leone) + total.

> Not all of the data are avaiable in the dataset.

#### Getting data

All the daily reports can be downloaded in various formats like:
- xml
- csv
- json
- etc

So for our application we can use simple and automated approach to get the data.
More details about tech strategy will be clear at implemetation stage. *But it's
a simle task - no problems to run into are expected.*

### Other sources

- More detailed but outdated: https://github.com/cmrivers/ebola
