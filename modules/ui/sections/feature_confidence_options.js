import {
    event as d3_event,
    select as d3_select
} from 'd3-selection';
import { scaleLinear as d3_scaleLinear } from 'd3-scale';

import { prefs } from '../../core/preferences';
import { t, localizer } from '../../core/localizer';
import { svgIcon } from '../../svg/icon';
import { uiSection } from '../section';


export function uiSectionFeatureConfidenceOptions(context) {

    var section = uiSection('feature-confidence-options', context)
        .title(t('background.feature_confidence'))
        .disclosureContent(renderDisclosureContent);

    // Load stored values
    let _minVal = prefs('feature_confidence_minVal');
    let _maxVal = prefs('feature_confidence_maxVal');
    let _step = prefs('feature_confidence_step');
    let _blueOnLeft = prefs('feature_confidence_blueOnLeft');
    let _lowOnLeft = prefs('feature_confidence_lowOnLeft');
    let _featureConfidenceThreshold = prefs('feature_confidence_threshold');

    // Set up defaults for unset values
    _minVal = _minVal !== null ? _minVal : 0;
    _maxVal = _maxVal !== null ? _maxVal : 1;
    _step = _step !== null ? _step : 0.1;
    _featureConfidenceThreshold = _featureConfidenceThreshold !== null ? _featureConfidenceThreshold : 0;
    _blueOnLeft = _blueOnLeft !== null ? _blueOnLeft : true;
    _lowOnLeft = _lowOnLeft !== null ? _lowOnLeft : true;

    // Store it all back
    prefs('feature_confidence_minVal', _minVal);
    prefs('feature_confidence_maxVal', _maxVal);
    prefs('feature_confidence_step', _step);
    prefs('feature_confidence_blueOnLeft', _blueOnLeft);
    prefs('feature_confidence_lowOnLeft', _lowOnLeft);
    prefs('feature_confidence_threshold', _featureConfidenceThreshold);

    const _sliderToValue = d3_scaleLinear().domain([0,1]).range([-1,1]).clamp(true);

    // var _storedConfidence = prefs('feature_confidence');
    var _sliders = ['feature_confidence'];
    var _defaultConfidence = _minVal;

    // var _featureConfidence = _storedConfidence !== null ? (+_storedConfidence) : _defaultConfidence;

    // if (_storedConfidence === null) {
    //     prefs('feature_confidence', 1 - _defaultConfidence);
    // }

    // function clamp(x, min, max) {
    //     return Math.max(min, Math.min(x, max));
    // }

    // function updateValue(val) {
    //     if (!val && d3_event && d3_event.target) {
    //         val = d3_event.target.value;
    //     }

    //     val = clamp(val, _minVal, _maxVal);

    //     _featureConfidence = 1 - val;
    //     prefs('feature_confidence', _featureConfidence);
    //     //Update the render
    //     context.map().pan([0,0]);

    //     section.reRender();
    // }

    function updateSliderUI(selection) {
        const slider = d3_select('.display-option-input');

        // Update the value from existing slider scale
        _featureConfidenceThreshold = _sliderToValue(slider.property('value'));
        prefs('feature_confidence_threshold', _featureConfidenceThreshold);

        // Update the scale
        if (_lowOnLeft !== _blueOnLeft) {
            _sliderToValue.range([_maxVal, _minVal]);
        } else {
            _sliderToValue.range([_minVal, _maxVal]);
        }
        
        // Update slider 
        slider
            .style('direction', function() {
                return _blueOnLeft ? null : 'rtl';
            });

        slider.attr('step', _step);
        slider.property('value', _sliderToValue.invert(_featureConfidenceThreshold));

        // Update the display
        selection.selectAll('.display-option-value')
            .text(function() {
                return Math.round(_featureConfidenceThreshold * 100) / 100;
            });
        // Re-render the map
        context.map().pan([0,0]);
    }

    function renderDisclosureContent(selection) {
        var container = selection.selectAll('.feature-confidence-container');
        container = container.data([0]);

        var containerEnter = container.enter()
            .append('div')
            .attr('class', 'feature-confidence-container controls-list');


        containerEnter
            .append('div')
            .attr('class', 'nudge-instructions')
            .text(t('background.confidence_description'));

        // add slider controls
        var slidersEnter = containerEnter.selectAll('.display-control')
            .data(_sliders)
            .enter()
            .append('div')
            .attr('class', function(d) { return 'display-control display-control-' + d; });

        slidersEnter
            .append('h5')
            .text(function(d) { return t('background.' + d); })
            .append('span')
            .attr('class', function(d) { return 'display-option-value display-option-value-' + d; });

        slidersEnter
            .append('span')
            .text('Blue on left')
            .append('input')
            .attr('type', 'checkbox')
            .attr('checked', 'true')
            .on('input', function() {
                _blueOnLeft = d3_select(this).property('checked');
                prefs('feature_confidence_blueOnLeft', _blueOnLeft);
                updateSliderUI(selection);
            });

        slidersEnter
            .append('br');

        slidersEnter
            .append('span')
            .text('Low on left')
            .append('input')
            .attr('type', 'checkbox')
            .attr('checked', 'true')
            .on('input', function() {
                _lowOnLeft = d3_select(this).property('checked');
                prefs('feature_confidence_lowOnLeft', _lowOnLeft);
                updateSliderUI(selection);
            });

        slidersEnter
            .append('br');

        const controls = slidersEnter
            .append('div')
            .style('display', 'flex')
            .style('flex-direction', 'column');

        let row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');
        
        row
            .append('div')
            .text('Min Value:');

        row
            .append('input')
            .attr('type', 'text')
            .attr('value', _minVal)
            .style('margin', '5px')
            .on('change', function() {
                _minVal = d3_select(this).property('value');
                prefs('feature_confidence_minVal', _minVal);
                updateSliderUI(selection);
            });

        // controls
        //     .append('br');
        row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        row
            .append('div')
            .text('Max Value:');

        row
            .append('input')
            .attr('type', 'text')
            .attr('value', _maxVal)
            .style('margin', '5px')
            .on('change', function() {
                _maxVal = d3_select(this).property('value');
                prefs('feature_confidence_maxVal', _maxVal);
                updateSliderUI(selection);
            });

        // slidersEnter
        //     .append('br');

        row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        row
            .append('div')
            .text('Resolution:');
        row
            .append('input')
            .attr('type', 'text')
            .attr('value', _step)
            .style('margin', '5px')
            .on('change', function() {
                const fullRange = _maxVal - _minVal;
                const stepCount = fullRange / d3_select(this).property('value');
                _step = 1 / (stepCount);
                prefs('feature_confidence_step', _step);
                updateSliderUI(selection);
            });

        // slidersEnter
        //     .append('br');

        row = controls
            .append('div')
            .style('display', 'flex')
            .style('align-items', 'center');

        row
            .append('div')
            .text('Range slider:');
        
        row
            .append('input')
            .attr('type', 'range')
            .attr('min', _minVal)
            .attr('max', _maxVal)
            .attr('height', '8px')
            .style('margin', '5px')
            // .attr('class', 'rangeSlider')
            .attr('class', function(d) { return 'display-option-input display-option-input-' + d; })
            .on('input', function() {
                updateSliderUI(selection);
            });
        
        updateSliderUI(selection);
        // slidersEnter
        //     .append('input')
        //     .attr('class', function(d) { return 'display-option-input display-option-input-' + d; })
        //     .attr('type', 'range')
        //     .attr('min', _minVal)
        //     .attr('max', _maxVal)
        //     .attr('step', '0.01')
        //     .property('value', 1 - _featureConfidence)
        //     .on('input', function() {
        //         var val = d3_select(this).property('value');
        //         updateValue(val);
        //     });

        // slidersEnter
        //     .append('button')
        //     .attr('title', t('background.reset_confidence'))
        //     .attr('class', function(d) { return 'display-option-reset display-option-reset-' + d; })
        //     .on('click', function() {
        //         if (d3_event.button !== 0) return;
        //         updateValue(1 - _defaultConfidence);
        //     })
        //     .call(svgIcon('#iD-icon-' + (localizer.textDirection() === 'rtl' ? 'redo' : 'undo')));

        // container = selection.selectAll('.feature-confidence-container');
        // container.selectAll('.display-option-input')
        //     .property('value', 1 - _featureConfidence);

        // container.selectAll('.display-option-value')
        //     .text(function() {
        //         return Math.round(_featureConfidence * 100) / 100;
        //     });

        // container.selectAll('.display-option-reset')
        //     .classed('disabled', function() { return _featureConfidence === _defaultConfidence; });

        // prefs('feature_confidence', _featureConfidence);
    }

    return section;
}
