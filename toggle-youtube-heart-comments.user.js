// ==UserScript==
// @name        Toggle YouTube Heart Comments
// @namespace   https://github.com/gslin/toggle-youtube-heart-comments-userscript
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.20210524.0
// @author      Gea-Suan Lin <gslin@gslin.com>
// @description Toggle YouTube heart comments.
// ==/UserScript==

(() => {
    'use strict;'

    let ob = new window.MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(() => {
                // Only filter pages whose path are "/watch".
                if (document.location.pathname !== '/watch') {
                    return;
                }

                let sheet = document.querySelector('.has-creator-heart-style');
                if (!sheet) {
                    sheet = document.createElement('style');
                    sheet.classList.add('has-creator-heart-style');
                    document.getElementsByTagName('head')[0].appendChild(sheet);
                }

                // Wait for ytd-comments element ready.
                let comments_el = document.querySelector('ytd-comments');
                if (!comments_el) {
                    return;
                }

                // Simulate "ytd-comment-thread-renderer:has(ytd-creator-heart-renderer)" selector.
                let comments_heart = document.querySelectorAll('ytd-comment-thread-renderer');
                comments_heart.forEach(el => {
                    if (el.querySelector('ytd-creator-heart-renderer')) {
                        el.classList.add('has-creator-heart');
                    }
                });

                // Don't install twice.
                if (document.getElementById('toggle_youtube_star_comments')) {
                    return;
                }

                let toggle_el = document.createElement('div');
                toggle_el.innerHTML = '<button id="toggle_youtube_star_comments">Toggle star comments</button>';
                toggle_el.addEventListener('click', () => {
                    if ('' === sheet.innerHTML) {
                        sheet.innerHTML = '.has-creator-heart { display: none; }';
                    } else {
                        sheet.innerHTML = '';
                    }
                });

                comments_el.insertAdjacentElement('beforebegin', toggle_el);
                console.debug('Toggle YouTube Heart Comments installed.');
            });
        });
    });

    ob.observe(document, {
        childList: true,
        subtree: true,
    });
})();
