import * as CSS from './lib/css';
import * as DOM from './lib/dom';
import cls from './lib/class-names';
import { toInt } from './lib/util';

export default function(i) {
  const element = i.element;

  i.containerWidth = element.clientWidth;
  i.containerHeight = element.clientHeight;
  i.contentWidth = i.settings.scrollContentWidth != null ?  i.settings.scrollContentWidth : element.scrollWidth;
  i.contentHeight = i.settings.scrollContentHeight != null ?  i.settings.scrollContentHeight : element.scrollHeight;

  if (!element.contains(i.scrollbarXRail)) {
    // clean up and append
    DOM.queryChildren(element, cls.element.rail('x')).forEach(el =>
      DOM.remove(el)
    );
    document.body.appendChild(i.scrollbarXRail);
  }
  if (!element.contains(i.scrollbarYRail)) {
    // clean up and append
    DOM.queryChildren(element, cls.element.rail('y')).forEach(el =>
      DOM.remove(el)
    );
    document.body.appendChild(i.scrollbarYRail);
  }

  if ( !i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth ) {
    i.scrollbarXActive = true;
    i.railXWidth = i.containerWidth - i.railXMarginWidth;
    i.railXRatio = i.containerWidth / i.railXWidth;
    i.scrollbarXWidth = getThumbSize( i, toInt(i.railXWidth * i.containerWidth / i.contentWidth ) );
    i.scrollbarXLeft = toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
  } else {
    i.scrollbarXActive = false;
  }

  if ( !i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight ) {
    i.scrollbarYActive = true;
    i.railYHeight = i.containerHeight - i.railYMarginHeight;
    i.railYRatio = i.containerHeight / i.railYHeight;
    i.scrollbarYHeight = getThumbSize( i, toInt(i.railYHeight * i.containerHeight / i.contentHeight ) );
    i.scrollbarYTop = toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
  } else {
    i.scrollbarYActive = false;
  }

  if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
    i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
  }
  if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
    i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
  }

  updateCss(element, i);

  if (i.scrollbarXActive) {
    i.scrollbarXRail.classList.add(cls.state.active('x'));
  } else {
    i.scrollbarXRail.classList.remove(cls.state.active('x'));
    i.scrollbarXWidth = 0;
    i.scrollbarXLeft = 0;
    element.scrollLeft = 0;
  }
  if (i.scrollbarYActive) {
    i.scrollbarYRail.classList.add(cls.state.active('y'));
  } else {
    i.scrollbarYRail.classList.remove(cls.state.active('y'));
    i.scrollbarYHeight = 0;
    i.scrollbarYTop = 0;
    element.scrollTop = 0;
  }
}

function getThumbSize(i, thumbSize) {
  if (i.settings.minScrollbarLength) {
    thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
  }
  if (i.settings.maxScrollbarLength) {
    thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
  }
  return thumbSize;
}

function updateCss(element, i) {
  const xRailOffset = { width: i.railXWidth };
  if (i.isRtl) {
    xRailOffset.left = i.containerLeft;
      // i.negativeScrollAdjustment +
      // element.scrollLeft +
      // i.containerWidth -
      // i.contentWidth;
  } else {
    xRailOffset.left = i.containerLeft; // + element.scrollLeft;
  }
  if (i.isScrollbarXUsingBottom) {
    xRailOffset.bottom = ( window.innerHeight - i.containerTop - i.containerHeight ); // i.scrollbarXBottom - element.scrollTop; fixed position !!
  } else {
    xRailOffset.top = ( i.containerTop + i.containerHeight ); // + i.scrollbarXTop + element.scrollTop; fixed position !!
  }
  CSS.set(i.scrollbarXRail, xRailOffset);

  const yRailOffset = { top: element.scrollTop, height: i.railYHeight };
  if (i.isScrollbarYUsingRight) {
    if (i.isRtl) {
      yRailOffset.right =
        ( window.innerWidth - i.containerLeft - i.containerWidth ); // -
        // i.contentWidth -
        // (i.negativeScrollAdjustment + element.scrollLeft) -
        // i.scrollbarYRight -
        // i.scrollbarYOuterWidth;
    } else {
      yRailOffset.right = ( window.innerWidth - i.containerLeft - i.containerWidth ); // + i.scrollbarYRight - element.scrollLeft;
    }
  } else {
    if (i.isRtl) {
      yRailOffset.left =
        ( i.containerLeft + i.containerWidth ); // +
        // i.negativeScrollAdjustment +
        // element.scrollLeft +
        // i.containerWidth * 2 -
        // i.contentWidth -
        // i.scrollbarYLeft -
        // i.scrollbarYOuterWidth;
    } else {
      yRailOffset.left = ( i.containerLeft + i.containerWidth ); // + i.scrollbarYLeft + element.scrollLeft;
    }
  }
  yRailOffset.top = i.containerTop;

  CSS.set(i.scrollbarYRail, yRailOffset);

  CSS.set(i.scrollbarX, {
    left: i.scrollbarXLeft,
    width: i.scrollbarXWidth - i.railBorderXWidth,
  });
  CSS.set(i.scrollbarY, {
    top: i.scrollbarYTop,
    height: i.scrollbarYHeight - i.railBorderYWidth,
  });
}
