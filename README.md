# [intra-sis](https://github.com/silverstripe-australia)

[![Build Status](https://travis-ci.org/silverstripe-australia/silverstripe-ba-sis.svg?branch=master)](https://travis-ci.org/silverstripe-australia/silverstripe-ba-sis)

**SilverStripe Australia** Standard Implementation Set, Intranet Module.

## Getting started

The simplest way to get started with this project is via composer - there's a 
_lot_ of dependent modules which will be much easier managed via composer than 
manually installing everything! 

We find it simplest using the SilverStripe Australia base project (Ozzy), but
it should work against any base install of SilverStripe 3.1.*. 

* $ `composer create-project -s dev silverstripe/ozzy myintranet`
* $ `composer require silverstripe-australia/intranet-sis`
* $ `composer require silverstripe-australia/minimalist-theme`
* $ `phing`

After this runs, you should have an 'installed' system; though it does need a 
couple of things to have things 'usable'. 

* The top level site needs to have the theme set to 'ssau-minimalist', and published
* A Site Dashboard Page created to act as the dashboard
* A homepage created as a redirector to point at the dashboard page. 

If you're comfortable, do the above manually... _or_ simple run the 
BootstrapIntranetsisTask which will create the required items

* $ `sake dev/tasks/BootstrapIntranetsisTask`



