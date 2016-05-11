# [Basis Community](https://packagist.org/packages/silverstripe-australia/ba-sis-community)

[![Build Status](https://travis-ci.org/silverstripe-australia/silverstripe-ba-sis-community.svg?branch=master)](https://travis-ci.org/silverstripe-australia/silverstripe-ba-sis-community)

Ba-SIS Community. **SilverStripe Australia** Standard Implementation Set, Community Package. AKA, Basis Community.

The recommended module compilation for a base SilverStripe project, which provides the most common, and what we consider to be the most fundamental components when building an intuitive and flexible platform for both users and developers alike.

These module dependencies will be updated over time, so please keep an eye out for future releases!

## Getting Started

The simplest way to get started with this project is via composer - there's a 
_lot_ of dependent modules which will be much easier managed via composer than 
manually installing everything! 

We find it simplest using the SilverStripe Australia base project, but
it should work against any base install of SilverStripe 3.1.*. 

* $ `composer create-project -s dev silverstripe-australia/base mycommunity`
* $ `composer require silverstripe-australia/ba-sis-community`
* $ `composer require silverstripe-australia/minimalist-theme`
* $ `phing`
* $ `sake dev/tasks/BootstrapCommunityTask`

Note: the last step above performs the following - if you're comfortable doing
these by yourself, skip the dev/task. 

* The top level site needs to have the theme set to 'ssau-minimalist', and published
* A Site Dashboard Page created to act as the dashboard
* A homepage created as a redirector to point at the dashboard page. 

If you load the site, you should be redirected to the /dashboard URL, which
will prompt you to login. The default user account is admin / admin which is 
configured in mysite/local.conf.php - please change this!



