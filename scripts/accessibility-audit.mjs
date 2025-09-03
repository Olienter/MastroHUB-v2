#!/usr/bin/env node

/**
 * Accessibility Audit for MastroHUB v2
 * WCAG 2.1 AA compliance validation and accessibility testing
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname, basename, extname } from "path";

class AccessibilityAudit {
  constructor() {
    this.wcagRules = {
      // WCAG 2.1 Level A & AA Guidelines
      perceivable: {
        '1.1.1': {
          name: 'Non-text Content',
          description: 'All non-text content has text alternatives',
          checks: [
            { pattern: /<img[^>]*>/g, required: ['alt='], message: 'Images must have alt attributes' },
            { pattern: /<svg[^>]*>/g, required: ['aria-label=', 'title='], message: 'SVGs must have aria-label or title' },
            { pattern: /<video[^>]*>/g, required: ['aria-label=', 'title='], message: 'Videos must have aria-label or title' },
            { pattern: /<audio[^>]*>/g, required: ['aria-label=', 'title='], message: 'Audio must have aria-label or title' }
          ]
        },
        '1.3.1': {
          name: 'Info and Relationships',
          description: 'Information and relationships are programmatically determined',
          checks: [
            { pattern: /<table[^>]*>/g, required: ['<th', '<caption'], message: 'Tables must have headers and captions' },
            { pattern: /<form[^>]*>/g, required: ['<label', 'aria-label='], message: 'Forms must have labels' },
            { pattern: /<fieldset[^>]*>/g, required: ['<legend'], message: 'Fieldsets must have legends' }
          ]
        },
        '1.4.1': {
          name: 'Use of Color',
          description: 'Color is not the only means of conveying information',
          checks: [
            { pattern: /color:\s*#[0-9a-fA-F]{3,6}/g, required: [], message: 'Avoid using color alone to convey information' },
            { pattern: /background-color:\s*#[0-9a-fA-F]{3,6}/g, required: [], message: 'Ensure sufficient color contrast' }
          ]
        },
        '1.4.3': {
          name: 'Contrast (Minimum)',
          description: 'Text has a contrast ratio of at least 4.5:1',
          checks: [
            { pattern: /color:\s*#[0-9a-fA-F]{3,6}/g, required: [], message: 'Check color contrast ratio (4.5:1 minimum)' },
            { pattern: /background:\s*#[0-9a-fA-F]{3,6}/g, required: [], message: 'Check background contrast ratio' }
          ]
        }
      },
      operable: {
        '2.1.1': {
          name: 'Keyboard',
          description: 'All functionality is available from a keyboard',
          checks: [
            { pattern: /<button[^>]*>/g, required: ['tabindex'], message: 'Buttons must be keyboard accessible' },
            { pattern: /<a[^>]*>/g, required: ['href=', 'tabindex'], message: 'Links must be keyboard accessible' },
            { pattern: /<input[^>]*>/g, required: ['tabindex'], message: 'Inputs must be keyboard accessible' }
          ]
        },
        '2.1.2': {
          name: 'No Keyboard Trap',
          description: 'Keyboard focus can be moved away from any component',
          checks: [
            { pattern: /tabindex="-1"/g, required: [], message: 'Avoid keyboard traps with tabindex="-1"' },
            { pattern: /onKeyDown/g, required: ['Escape'], message: 'Provide escape mechanism for keyboard traps' }
          ]
        },
        '2.4.1': {
          name: 'Bypass Blocks',
          description: 'A mechanism is available to bypass blocks of content',
          checks: [
            { pattern: /<main[^>]*>/g, required: [], message: 'Use semantic main element' },
            { pattern: /<nav[^>]*>/g, required: [], message: 'Use semantic nav element' },
            { pattern: /skip-to-content/g, required: [], message: 'Provide skip-to-content link' }
          ]
        },
        '2.4.3': {
          name: 'Focus Order',
          description: 'Focusable components receive focus in an order that preserves meaning',
          checks: [
            { pattern: /tabindex/g, required: [], message: 'Ensure logical tab order' },
            { pattern: /tabindex="[0-9]+"/g, required: [], message: 'Avoid positive tabindex values' }
          ]
        },
        '2.4.4': {
          name: 'Link Purpose',
          description: 'The purpose of each link can be determined from the link text alone',
          checks: [
            { pattern: /<a[^>]*>.*?<\/a>/g, required: [], message: 'Link text should be descriptive' },
            { pattern: /href="#"/g, required: [], message: 'Avoid empty or placeholder links' },
            { pattern: /href="javascript:/g, required: [], message: 'Avoid javascript: links' }
          ]
        }
      },
      understandable: {
        '3.1.1': {
          name: 'Language of Page',
          description: 'The default human language of each page can be programmatically determined',
          checks: [
            { pattern: /<html[^>]*>/g, required: ['lang='], message: 'HTML must have lang attribute' },
            { pattern: /lang="[a-z]{2}"/g, required: [], message: 'Use valid language codes' }
          ]
        },
        '3.2.1': {
          name: 'On Focus',
          description: 'When any component receives focus, it does not initiate a change of context',
          checks: [
            { pattern: /onFocus/g, required: [], message: 'Avoid context changes on focus' },
            { pattern: /onBlur/g, required: [], message: 'Avoid context changes on blur' }
          ]
        },
        '3.2.2': {
          name: 'On Input',
          description: 'Changing the setting of any user interface component does not automatically cause a change of context',
          checks: [
            { pattern: /onChange/g, required: [], message: 'Avoid automatic context changes on input' },
            { pattern: /onSelect/g, required: [], message: 'Avoid automatic context changes on select' }
          ]
        },
        '3.3.1': {
          name: 'Error Identification',
          description: 'If an input error is automatically detected, the error is identified and described to the user',
          checks: [
            { pattern: /<input[^>]*>/g, required: ['aria-invalid', 'aria-describedby'], message: 'Form inputs need error handling' },
            { pattern: /<select[^>]*>/g, required: ['aria-invalid', 'aria-describedby'], message: 'Select elements need error handling' },
            { pattern: /<textarea[^>]*>/g, required: ['aria-invalid', 'aria-describedby'], message: 'Textareas need error handling' }
          ]
        },
        '3.3.2': {
          name: 'Labels or Instructions',
          description: 'Labels or instructions are provided when content requires user input',
          checks: [
            { pattern: /<input[^>]*>/g, required: ['<label', 'aria-label=', 'aria-labelledby='], message: 'Inputs must have labels' },
            { pattern: /<select[^>]*>/g, required: ['<label', 'aria-label=', 'aria-labelledby='], message: 'Selects must have labels' },
            { pattern: /<textarea[^>]*>/g, required: ['<label', 'aria-label=', 'aria-labelledby='], message: 'Textareas must have labels' }
          ]
        }
      },
      robust: {
        '4.1.1': {
          name: 'Parsing',
          description: 'Content is valid and can be parsed by assistive technologies',
          checks: [
            { pattern: /<div[^>]*><\/div>/g, required: [], message: 'Avoid empty divs' },
            { pattern: /<span[^>]*><\/span>/g, required: [], message: 'Avoid empty spans' },
            { pattern: /<p[^>]*><\/p>/g, required: [], message: 'Avoid empty paragraphs' }
          ]
        },
        '4.1.2': {
          name: 'Name, Role, Value',
          description: 'All UI components have accessible names, roles, and values',
          checks: [
            { pattern: /<button[^>]*>/g, required: ['aria-label=', 'aria-labelledby=', '>.*?</button>'], message: 'Buttons need accessible names' },
            { pattern: /<input[^>]*>/g, required: ['aria-label=', 'aria-labelledby=', 'placeholder='], message: 'Inputs need accessible names' },
            { pattern: /<select[^>]*>/g, required: ['aria-label=', 'aria-labelledby='], message: 'Selects need accessible names' }
          ]
        }
      }
    };
    
    this.accessibilityIssues = [];
    this.componentAnalysis = {};
  }

  async runAccessibilityAudit() {
    console.log("♿ Running WCAG 2.1 AA Accessibility Audit...");
    
    // Analyze all components
    await this.analyzeComponents();
    
    // Check WCAG compliance
    await this.checkWCAGCompliance();
    
    // Check semantic HTML usage
    await this.checkSemanticHTML();
    
    // Check ARIA implementation
    await this.checkARIAImplementation();
    
    // Generate accessibility report
    const report = this.generateAccessibilityReport();
    
    return report;
  }

  async analyzeComponents() {
    console.log("📊 Analyzing component accessibility...");
    
    const componentsDir = "components";
    if (!existsSync(componentsDir)) {
      console.log("❌ Components directory not found");
      return;
    }

    const components = this.getComponentFiles(componentsDir);
    
    for (const component of components) {
      const analysis = await this.analyzeComponent(component);
      this.componentAnalysis[basename(component, extname(component))] = analysis;
    }

    console.log(`✅ Analyzed ${components.length} components for accessibility`);
  }

  getComponentFiles(dir, files = []) {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.getComponentFiles(fullPath, files);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async analyzeComponent(filePath) {
    const content = readFileSync(filePath, 'utf8');
    const componentName = basename(filePath, extname(filePath));
    
    const analysis = {
      name: componentName,
      path: filePath,
      score: 100,
      issues: [],
      warnings: [],
      wcagCompliance: {
        perceivable: this.checkWCAGCategory(content, 'perceivable'),
        operable: this.checkWCAGCategory(content, 'operable'),
        understandable: this.checkWCAGCategory(content, 'understandable'),
        robust: this.checkWCAGCategory(content, 'robust')
      },
      semanticHTML: this.checkSemanticHTML(content),
      ariaImplementation: this.checkARIAImplementation(content),
      keyboardAccessibility: this.checkKeyboardAccessibility(content)
    };

    // Calculate overall score
    const categoryScores = [
      analysis.wcagCompliance.perceivable.score || 0,
      analysis.wcagCompliance.operable.score || 0,
      analysis.wcagCompliance.understandable.score || 0,
      analysis.wcagCompliance.robust.score || 0,
      analysis.semanticHTML.score || 0,
      analysis.ariaImplementation.score || 0,
      analysis.keyboardAccessibility.score || 0
    ];
    
    analysis.score = Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length);

    // Collect all issues and warnings
    Object.values(analysis.wcagCompliance).forEach(category => {
      if (category.issues) analysis.issues.push(...category.issues);
      if (category.warnings) analysis.warnings.push(...category.warnings);
    });
    
    if (analysis.semanticHTML.issues) analysis.issues.push(...analysis.semanticHTML.issues);
    if (analysis.semanticHTML.warnings) analysis.warnings.push(...analysis.semanticHTML.warnings);
    
    if (analysis.ariaImplementation.issues) analysis.issues.push(...analysis.ariaImplementation.issues);
    if (analysis.ariaImplementation.warnings) analysis.warnings.push(...analysis.ariaImplementation.warnings);
    
    if (analysis.keyboardAccessibility.issues) analysis.issues.push(...analysis.keyboardAccessibility.issues);
    if (analysis.keyboardAccessibility.warnings) analysis.warnings.push(...analysis.keyboardAccessibility.warnings);

    return analysis;
  }

  checkWCAGCategory(content, category) {
    const result = { score: 100, issues: [], warnings: [] };
    const rules = this.wcagRules[category];
    
    if (!rules) return result;
    
    Object.entries(rules).forEach(([guideline, rule]) => {
      rule.checks.forEach(check => {
        const matches = content.match(check.pattern);
        if (matches) {
          // Check if required attributes are present
          const hasRequired = check.required.every(req => content.includes(req));
          if (!hasRequired) {
            result.issues.push(`${guideline} ${rule.name}: ${check.message}`);
            result.score -= 15;
          } else {
            result.warnings.push(`${guideline} ${rule.name}: ${check.message} - OK`);
            result.score += 5;
          }
        }
      });
    });
    
    return result;
  }

  checkSemanticHTML(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for semantic HTML elements
    const semanticElements = [
      { pattern: /<main[^>]*>/g, message: 'Good: Using semantic main element' },
      { pattern: /<nav[^>]*>/g, message: 'Good: Using semantic nav element' },
      { pattern: /<header[^>]*>/g, message: 'Good: Using semantic header element' },
      { pattern: /<footer[^>]*>/g, message: 'Good: Using semantic footer element' },
      { pattern: /<section[^>]*>/g, message: 'Good: Using semantic section element' },
      { pattern: /<article[^>]*>/g, message: 'Good: Using semantic article element' },
      { pattern: /<aside[^>]*>/g, message: 'Good: Using semantic aside element' },
      { pattern: /<h[1-6][^>]*>/g, message: 'Good: Using heading elements' }
    ];
    
    semanticElements.forEach(element => {
      const matches = content.match(element.pattern);
      if (matches) {
        result.warnings.push(`${element.message}: ${matches.length} found`);
        result.score += 5;
      }
    });
    
    // Check for heading hierarchy
    const headings = content.match(/<h[1-6][^>]*>/g);
    if (headings) {
      const headingLevels = headings.map(h => parseInt(h.match(/<h([1-6])/)[1]));
      let hasProperHierarchy = true;
      
      for (let i = 1; i < headingLevels.length; i++) {
        if (headingLevels[i] - headingLevels[i-1] > 1) {
          hasProperHierarchy = false;
          break;
        }
      }
      
      if (!hasProperHierarchy) {
        result.issues.push('Improper heading hierarchy - skip heading levels');
        result.score -= 20;
      } else {
        result.warnings.push('Good: Proper heading hierarchy');
        result.score += 10;
      }
    }
    
    // Check for div soup (too many divs)
    const divs = content.match(/<div[^>]*>/g);
    const semanticCount = semanticElements.reduce((count, element) => {
      const matches = content.match(element.pattern);
      return count + (matches ? matches.length : 0);
    }, 0);
    
    if (divs && divs.length > semanticCount * 2) {
      result.issues.push('Too many div elements - use semantic HTML instead');
      result.score -= 15;
    }
    
    return result;
  }

  checkARIAImplementation(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for ARIA attributes
    const ariaAttributes = [
      { pattern: /aria-label=/g, message: 'Good: Using aria-label' },
      { pattern: /aria-labelledby=/g, message: 'Good: Using aria-labelledby' },
      { pattern: /aria-describedby=/g, message: 'Good: Using aria-describedby' },
      { pattern: /aria-expanded=/g, message: 'Good: Using aria-expanded' },
      { pattern: /aria-hidden=/g, message: 'Good: Using aria-hidden' },
      { pattern: /aria-live=/g, message: 'Good: Using aria-live' },
      { pattern: /aria-atomic=/g, message: 'Good: Using aria-atomic' },
      { pattern: /aria-busy=/g, message: 'Good: Using aria-busy' }
    ];
    
    ariaAttributes.forEach(attr => {
      const matches = content.match(attr.pattern);
      if (matches) {
        result.warnings.push(`${attr.message}: ${matches.length} found`);
        result.score += 5;
      }
    });
    
    // Check for ARIA roles
    const ariaRoles = [
      { pattern: /role="button"/g, message: 'Good: Using button role' },
      { pattern: /role="navigation"/g, message: 'Good: Using navigation role' },
      { pattern: /role="main"/g, message: 'Good: Using main role' },
      { pattern: /role="banner"/g, message: 'Good: Using banner role' },
      { pattern: /role="contentinfo"/g, message: 'Good: Using contentinfo role' },
      { pattern: /role="complementary"/g, message: 'Good: Using complementary role' },
      { pattern: /role="region"/g, message: 'Good: Using region role' },
      { pattern: /role="dialog"/g, message: 'Good: Using dialog role' },
      { pattern: /role="alert"/g, message: 'Good: Using alert role' },
      { pattern: /role="status"/g, message: 'Good: Using status role' }
    ];
    
    ariaRoles.forEach(role => {
      const matches = content.match(role.pattern);
      if (matches) {
        result.warnings.push(`${role.message}: ${matches.length} found`);
        result.score += 5;
      }
    });
    
    // Check for missing ARIA on interactive elements
    const interactiveElements = ['button', 'input', 'select', 'textarea', 'a'];
    interactiveElements.forEach(element => {
      const pattern = new RegExp(`<${element}[^>]*>`, 'g');
      const matches = content.match(pattern);
      if (matches) {
        const hasAria = matches.some(match => 
          match.includes('aria-') || match.includes('role=')
        );
        if (!hasAria) {
          result.issues.push(`Interactive element <${element}> missing ARIA attributes`);
          result.score -= 10;
        }
      }
    });
    
    return result;
  }

  checkKeyboardAccessibility(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for keyboard event handlers
    const keyboardEvents = [
      { pattern: /onKeyDown/g, message: 'Good: Using onKeyDown handler' },
      { pattern: /onKeyUp/g, message: 'Good: Using onKeyUp handler' },
      { pattern: /onKeyPress/g, message: 'Good: Using onKeyPress handler' }
    ];
    
    keyboardEvents.forEach(event => {
      const matches = content.match(event.pattern);
      if (matches) {
        result.warnings.push(`${event.message}: ${matches.length} found`);
        result.score += 5;
      }
    });
    
    // Check for tabindex usage
    const tabindexPattern = /tabindex=/g;
    const tabindexMatches = content.match(tabindexPattern);
    if (tabindexMatches) {
      result.warnings.push(`Using tabindex: ${tabindexMatches.length} found`);
      result.score += 5;
    }
    
    // Check for focus management
    const focusPatterns = [
      { pattern: /onFocus/g, message: 'Good: Using onFocus handler' },
      { pattern: /onBlur/g, message: 'Good: Using onBlur handler' },
      { pattern: /focus\(\)/g, message: 'Good: Programmatic focus management' }
    ];
    
    focusPatterns.forEach(pattern => {
      const matches = content.match(pattern.pattern);
      if (matches) {
        result.warnings.push(`${pattern.message}: ${matches.length} found`);
        result.score += 5;
      }
    });
    
    // Check for escape key handling
    if (content.includes('onKeyDown') && !content.includes('Escape')) {
      result.issues.push('Missing Escape key handling for keyboard traps');
      result.score -= 15;
    }
    
    return result;
  }

  async checkWCAGCompliance() {
    console.log("♿ Checking WCAG 2.1 AA compliance...");
    
    const compliance = {
      perceivable: 0,
      operable: 0,
      understandable: 0,
      robust: 0
    };
    
    Object.values(this.componentAnalysis).forEach(component => {
      Object.entries(component.wcagCompliance).forEach(([category, analysis]) => {
        if (analysis.score > 80) {
          compliance[category]++;
        }
      });
    });
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    
    console.log(`✅ WCAG Compliance:`);
    console.log(`  Perceivable: ${Math.round((compliance.perceivable / totalComponents) * 100)}%`);
    console.log(`  Operable: ${Math.round((compliance.operable / totalComponents) * 100)}%`);
    console.log(`  Understandable: ${Math.round((compliance.understandable / totalComponents) * 100)}%`);
    console.log(`  Robust: ${Math.round((compliance.robust / totalComponents) * 100)}%`);
  }

  async checkSemanticHTML() {
    console.log("🏗️ Checking semantic HTML usage...");
    
    const semanticComponents = Object.values(this.componentAnalysis)
      .filter(component => component.semanticHTML.score > 80).length;
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    const semanticPercentage = Math.round((semanticComponents / totalComponents) * 100);
    
    console.log(`✅ Semantic HTML usage: ${semanticPercentage}% of components`);
  }

  async checkARIAImplementation() {
    console.log("🎭 Checking ARIA implementation...");
    
    const ariaComponents = Object.values(this.componentAnalysis)
      .filter(component => component.ariaImplementation.score > 80).length;
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    const ariaPercentage = Math.round((ariaComponents / totalComponents) * 100);
    
    console.log(`✅ ARIA implementation: ${ariaPercentage}% of components`);
  }

  generateAccessibilityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      components: this.componentAnalysis,
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };

    // Save report
    const reportFile = `.ai/reports/accessibility-audit-report-${Date.now()}.json`;
    writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  generateSummary() {
    const components = Object.values(this.componentAnalysis);
    const totalComponents = components.length;
    
    const avgScore = Math.round(
      components.reduce((sum, comp) => sum + comp.score, 0) / totalComponents
    );
    
    const totalIssues = components.reduce((sum, comp) => sum + comp.issues.length, 0);
    const totalWarnings = components.reduce((sum, comp) => sum + comp.warnings.length, 0);
    
    const wcagCompliance = {
      perceivable: Math.round(components.reduce((sum, comp) => sum + comp.wcagCompliance.perceivable.score, 0) / totalComponents),
      operable: Math.round(components.reduce((sum, comp) => sum + comp.wcagCompliance.operable.score, 0) / totalComponents),
      understandable: Math.round(components.reduce((sum, comp) => sum + comp.wcagCompliance.understandable.score, 0) / totalComponents),
      robust: Math.round(components.reduce((sum, comp) => sum + comp.wcagCompliance.robust.score, 0) / totalComponents)
    };
    
    const accessibilityFeatures = {
      semanticHTML: Math.round(components.reduce((sum, comp) => sum + comp.semanticHTML.score, 0) / totalComponents),
      ariaImplementation: Math.round(components.reduce((sum, comp) => sum + comp.ariaImplementation.score, 0) / totalComponents),
      keyboardAccessibility: Math.round(components.reduce((sum, comp) => sum + comp.keyboardAccessibility.score, 0) / totalComponents)
    };
    
    return {
      totalComponents,
      averageScore: avgScore,
      totalIssues,
      totalWarnings,
      wcagCompliance,
      accessibilityFeatures,
      status: avgScore >= 90 ? 'excellent' : avgScore >= 75 ? 'good' : avgScore >= 60 ? 'fair' : 'needs-improvement'
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const summary = this.generateSummary();
    
    if (summary.wcagCompliance.perceivable < 80) {
      recommendations.push('Improve perceivable content - add alt text, captions, and proper contrast');
    }
    
    if (summary.wcagCompliance.operable < 80) {
      recommendations.push('Improve operability - ensure keyboard accessibility and focus management');
    }
    
    if (summary.wcagCompliance.understandable < 80) {
      recommendations.push('Improve understandability - add proper labels and error handling');
    }
    
    if (summary.wcagCompliance.robust < 80) {
      recommendations.push('Improve robustness - use semantic HTML and proper ARIA implementation');
    }
    
    if (summary.accessibilityFeatures.semanticHTML < 80) {
      recommendations.push('Use more semantic HTML elements (main, nav, header, footer, section, article)');
    }
    
    if (summary.accessibilityFeatures.ariaImplementation < 80) {
      recommendations.push('Implement ARIA attributes for better screen reader support');
    }
    
    if (summary.accessibilityFeatures.keyboardAccessibility < 80) {
      recommendations.push('Improve keyboard accessibility - add keyboard event handlers and focus management');
    }
    
    if (summary.totalIssues > 0) {
      recommendations.push(`Fix ${summary.totalIssues} accessibility issues across components`);
    }
    
    return recommendations;
  }

  generateNextSteps() {
    return [
      '1. Fix critical accessibility issues',
      '2. Add missing ARIA attributes',
      '3. Implement keyboard navigation',
      '4. Test with screen readers',
      '5. Validate color contrast ratios',
      '6. Set up automated accessibility testing'
    ];
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case "audit":
        const report = await this.runAccessibilityAudit();
        this.printReport(report);
        break;
        
      case "analyze":
        await this.analyzeComponents();
        console.log("✅ Component analysis complete");
        break;
        
      default:
        console.log("♿ MastroHUB v2 Accessibility Audit");
        console.log("\nUsage:");
        console.log("  node accessibility-audit.mjs audit   - Full accessibility audit");
        console.log("  node accessibility-audit.mjs analyze - Analyze components only");
        break;
    }
  }

  printReport(report) {
    console.log("\n♿ ACCESSIBILITY AUDIT REPORT");
    console.log("=" .repeat(60));
    
    console.log("\n📊 SUMMARY");
    console.log(`Total Components: ${report.summary.totalComponents}`);
    console.log(`Average Score: ${report.summary.averageScore}/100`);
    console.log(`Status: ${report.summary.status.toUpperCase()}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Total Warnings: ${report.summary.totalWarnings}`);
    
    console.log("\n♿ WCAG 2.1 AA COMPLIANCE");
    console.log(`Perceivable: ${report.summary.wcagCompliance.perceivable}/100`);
    console.log(`Operable: ${report.summary.wcagCompliance.operable}/100`);
    console.log(`Understandable: ${report.summary.wcagCompliance.understandable}/100`);
    console.log(`Robust: ${report.summary.wcagCompliance.robust}/100`);
    
    console.log("\n🎭 ACCESSIBILITY FEATURES");
    console.log(`Semantic HTML: ${report.summary.accessibilityFeatures.semanticHTML}/100`);
    console.log(`ARIA Implementation: ${report.summary.accessibilityFeatures.ariaImplementation}/100`);
    console.log(`Keyboard Accessibility: ${report.summary.accessibilityFeatures.keyboardAccessibility}/100`);
    
    console.log("\n🧩 COMPONENT SCORES");
    Object.entries(report.components).forEach(([name, component]) => {
      console.log(`${name}: ${component.score}/100`);
      if (component.issues.length > 0) {
        console.log(`  Issues: ${component.issues.length}`);
      }
      if (component.warnings.length > 0) {
        console.log(`  Warnings: ${component.warnings.length}`);
      }
    });
    
    console.log("\n💡 RECOMMENDATIONS");
    report.recommendations.forEach(rec => console.log(`- ${rec}`));
    
    console.log("\n🚀 NEXT STEPS");
    report.nextSteps.forEach(step => console.log(step));
    
    console.log("\n" + "=" .repeat(60));
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('accessibility-audit.mjs')) {
  const audit = new AccessibilityAudit();
  audit.run().catch(error => {
    console.error("❌ Accessibility audit failed:", error.message);
    process.exit(1);
  });
}

export default AccessibilityAudit;
