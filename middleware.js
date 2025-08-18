import { NextResponse, NextRequest, userAgent } from 'next/server';
import { headers } from 'next/headers'

async function middleware(req, res) {
  const requestHeaders = new Headers(req.headers)
  const isBot =  userAgent(req).isBot
  const currentDomain = requestHeaders.get('host')
  const path = req?.nextUrl?.pathname
  const siteDomain = 'cadmap.su';
  // const subdomain = '213.189.221.243';
  // const newDomain = 'cadmap.su';
  const subdomain = 'doc.cadmap.su'
  // const wwwDomain = 'www.cadmap.su'

  // если человек и входящий домен совпадает с реальным - редиректим его на поддомен или другой домен
  if (!isBot && currentDomain === siteDomain) {
    return NextResponse.redirect(`https://${subdomain}${path}`, 301);
  }

// если бот зашел вдруг на поддомен или другой домен- редиректим его обратно на реальный домен
  if (isBot && currentDomain === subdomain) {
    return NextResponse.redirect(`https://${siteDomain}${path}`, 301);
  }


  if (!isBot && currentDomain === 'fkad.su') {
    return NextResponse.redirect(`https://${subdomain}${path}`, 301);
  }

  if (isBot && currentDomain === 'fkad.su') {
    return NextResponse.redirect(`https://${siteDomain}${path}`, 301);
  }

  //редирект для яндекса для склейки доменов

  // if (isBot && currentDomain === siteDomain) {
  //   return NextResponse.redirect(`https://${newDomain}${path}`, 301);
  // }


  // Во всех остальных случаях не делаем редирект
  return NextResponse.next();
}

export default middleware