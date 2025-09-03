#!/usr/bin/env node

/**
 * Design Consistency Checker for MastroHUB v2
 * Automated validation of design system consistency across components
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname, basename, extname } from "path";

class DesignConsistencyChecker {
  constructor() {
    this.designRules = {
      colors: {
        required: ['primary', 'secondary', 'accent', 'success', 'warning', 'error'],
        forbidden: ['#000000', '#ffffff', 'black', 'white', 'red', 'blue', 'green'],
        patterns: [
          { pattern: /var\(--color-[^)]+\)/g, message: 'Use CSS variables for colors' },
          { pattern: /#[0-9a-fA-F]{3,6}/g, message: 'Avoid hardcoded hex colors' },
          { pattern: /rgb\(/g, message: 'Avoid rgb() colors, use CSS variables' },
          { pattern: /rgba\(/g, message: 'Avoid rgba() colors, use CSS variables' }
        ]
      },
      spacing: {
        required: ['var(--space-', 'p-', 'm-', 'gap-', 'space-'],
        forbidden: ['px-', 'py-', 'mx-', 'my-'],
        patterns: [
          { pattern: /var\(--space-[^)]+\)/g, message: 'Use CSS variables for spacing' },
          { pattern: /\b\d+px\b/g, message: 'Avoid hardcoded pixel values for spacing' },
          { pattern: /\b\d+rem\b/g, message: 'Use CSS variables instead of hardcoded rem values' }
        ]
      },
      typography: {
        required: ['var(--step-', 'var(--leading-', 'var(--weight-'],
        forbidden: ['font-size:', 'line-height:', 'font-weight:'],
        patterns: [
          { pattern: /var\(--step-[^)]+\)/g, message: 'Use CSS variables for font sizes' },
          { pattern: /var\(--leading-[^)]+\)/g, message: 'Use CSS variables for line heights' },
          { pattern: /var\(--weight-[^)]+\)/g, message: 'Use CSS variables for font weights' },
          { pattern: /\b\d+px\b/g, message: 'Avoid hardcoded pixel values for typography' }
        ]
      },
      accessibility: {
        required: ['aria-', 'role=', 'tabindex', 'alt=', 'title='],
        patterns: [
          { pattern: /aria-label=/g, message: 'Good: aria-label provided' },
          { pattern: /aria-describedby=/g, message: 'Good: aria-describedby provided' },
          { pattern: /role=/g, message: 'Good: role attribute provided' },
          { pattern: /tabindex=/g, message: 'Good: tabindex provided' },
          { pattern: /alt=/g, message: 'Good: alt text provided' }
        ]
      },
      responsive: {
        required: ['sm:', 'md:', 'lg:', 'xl:'],
        patterns: [
          { pattern: /sm:/g, message: 'Good: mobile-first responsive design' },
          { pattern: /md:/g, message: 'Good: tablet breakpoint used' },
          { pattern: /lg:/g, message: 'Good: desktop breakpoint used' },
          { pattern: /xl:/g, message: 'Good: large desktop breakpoint used' }
        ]
      }
    };
    
    this.consistencyIssues = [];
    this.componentAnalysis = {};
  }

  async checkConsistency() {
    console.log("🔍 Checking design consistency across components...");
    
    // Analyze all components
    await this.analyzeComponents();
    
    // Check design system compliance
    await this.checkDesignSystemCompliance();
    
    // Check accessibility compliance
    await this.checkAccessibilityCompliance();
    
    // Check responsive design compliance
    await this.checkResponsiveCompliance();
    
    // Generate consistency report
    const report = this.generateConsistencyReport();
    
    return report;
  }

  async analyzeComponents() {
    console.log("📊 Analyzing component consistency...");
    
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

    console.log(`✅ Analyzed ${components.length} components for consistency`);
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
      issues: [],
      warnings: [],
      score: 100,
      categories: {
        colors: this.checkColorConsistency(content),
        spacing: this.checkSpacingConsistency(content),
        typography: this.checkTypographyConsistency(content),
        accessibility: this.checkAccessibilityConsistency(content),
        responsive: this.checkResponsiveConsistency(content)
      }
    };

    // Calculate overall score
    const categoryScores = Object.values(analysis.categories).map(cat => cat.score);
    analysis.score = Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length);

    // Collect all issues
    Object.values(analysis.categories).forEach(category => {
      analysis.issues.push(...category.issues);
      analysis.warnings.push(...category.warnings);
    });

    return analysis;
  }

  checkColorConsistency(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for forbidden color patterns
    this.designRules.colors.patterns.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        result.issues.push(`${rule.message}: ${matches.join(', ')}`);
        result.score -= 10;
      }
    });
    
    // Check for forbidden colors
    this.designRules.colors.forbidden.forEach(color => {
      if (content.includes(color)) {
        result.issues.push(`Forbidden color used: ${color}`);
        result.score -= 15;
      }
    });
    
    // Check for required color variables
    const hasColorVariables = this.designRules.colors.required.some(required => 
      content.includes(required)
    );
    
    if (!hasColorVariables) {
      result.warnings.push('No design system color variables found');
      result.score -= 5;
    }
    
    return result;
  }

  checkSpacingConsistency(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for forbidden spacing patterns
    this.designRules.spacing.patterns.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        result.issues.push(`${rule.message}: ${matches.join(', ')}`);
        result.score -= 10;
      }
    });
    
    // Check for forbidden spacing classes
    this.designRules.spacing.forbidden.forEach(spacing => {
      if (content.includes(spacing)) {
        result.issues.push(`Forbidden spacing class: ${spacing}`);
        result.score -= 5;
      }
    });
    
    // Check for required spacing variables
    const hasSpacingVariables = this.designRules.spacing.required.some(required => 
      content.includes(required)
    );
    
    if (!hasSpacingVariables) {
      result.warnings.push('No design system spacing variables found');
      result.score -= 5;
    }
    
    return result;
  }

  checkTypographyConsistency(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for forbidden typography patterns
    this.designRules.typography.patterns.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        result.issues.push(`${rule.message}: ${matches.join(', ')}`);
        result.score -= 10;
      }
    });
    
    // Check for forbidden typography properties
    this.designRules.typography.forbidden.forEach(prop => {
      if (content.includes(prop)) {
        result.issues.push(`Forbidden typography property: ${prop}`);
        result.score -= 15;
      }
    });
    
    // Check for required typography variables
    const hasTypographyVariables = this.designRules.typography.required.some(required => 
      content.includes(required)
    );
    
    if (!hasTypographyVariables) {
      result.warnings.push('No design system typography variables found');
      result.score -= 5;
    }
    
    return result;
  }

  checkAccessibilityConsistency(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for required accessibility attributes
    const hasAccessibility = this.designRules.accessibility.required.some(required => 
      content.includes(required)
    );
    
    if (!hasAccessibility) {
      result.issues.push('Missing accessibility attributes');
      result.score -= 20;
    }
    
    // Check for good accessibility patterns
    this.designRules.accessibility.patterns.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        result.warnings.push(`${rule.message}`);
        result.score += 5; // Bonus for good accessibility
      }
    });
    
    // Check for interactive elements without accessibility
    const interactiveElements = ['button', 'input', 'select', 'textarea', 'a'];
    interactiveElements.forEach(element => {
      if (content.includes(`<${element}`) && !content.includes('aria-') && !content.includes('role=')) {
        result.issues.push(`Interactive element <${element}> missing accessibility attributes`);
        result.score -= 10;
      }
    });
    
    return result;
  }

  checkResponsiveConsistency(content) {
    const result = { score: 100, issues: [], warnings: [] };
    
    // Check for responsive design patterns
    const hasResponsive = this.designRules.responsive.required.some(required => 
      content.includes(required)
    );
    
    if (!hasResponsive) {
      result.issues.push('Component not responsive');
      result.score -= 25;
    }
    
    // Check for good responsive patterns
    this.designRules.responsive.patterns.forEach(rule => {
      const matches = content.match(rule.pattern);
      if (matches) {
        result.warnings.push(`${rule.message}`);
        result.score += 5; // Bonus for good responsive design
      }
    });
    
    return result;
  }

  async checkDesignSystemCompliance() {
    console.log("🎨 Checking design system compliance...");
    
    // Check if components use design tokens consistently
    const tokenUsage = {
      colors: 0,
      spacing: 0,
      typography: 0
    };
    
    Object.values(this.componentAnalysis).forEach(component => {
      if (component.categories.colors.score > 80) tokenUsage.colors++;
      if (component.categories.spacing.score > 80) tokenUsage.spacing++;
      if (component.categories.typography.score > 80) tokenUsage.typography++;
    });
    
    const totalComponents = Object.keys(this.componentAnalysis).length;
    const compliance = {
      colors: Math.round((tokenUsage.colors / totalComponents) * 100),
      spacing: Math.round((tokenUsage.spacing / totalComponents) * 100),
      typography: Math.round((tokenUsage.typography / totalComponents) * 100)
    };
    
    console.log(`✅ Design system compliance: Colors ${compliance.colors}%, Spacing ${compliance.spacing}%, Typography ${compliance.typography}%`);
  }

  async checkAccessibilityCompliance() {
    console.log("♿ Checking accessibility compliance...");
    
    const accessibilityScores = Object.values(this.componentAnalysis)
      .map(component => component.categories.accessibility.score);
    
    const avgAccessibilityScore = Math.round(
      accessibilityScores.reduce((sum, score) => sum + score, 0) / accessibilityScores.length
    );
    
    console.log(`✅ Average accessibility score: ${avgAccessibilityScore}/100`);
  }

  async checkResponsiveCompliance() {
    console.log("📱 Checking responsive design compliance...");
    
    const responsiveScores = Object.values(this.componentAnalysis)
      .map(component => component.categories.responsive.score);
    
    const avgResponsiveScore = Math.round(
      responsiveScores.reduce((sum, score) => sum + score, 0) / responsiveScores.length
    );
    
    console.log(`✅ Average responsive score: ${avgResponsiveScore}/100`);
  }

  generateConsistencyReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.generateSummary(),
      components: this.componentAnalysis,
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };

    // Save report
    const reportFile = `.ai/reports/design-consistency-report-${Date.now()}.json`;
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
    
    const categories = {
      colors: Math.round(components.reduce((sum, comp) => sum + comp.categories.colors.score, 0) / totalComponents),
      spacing: Math.round(components.reduce((sum, comp) => sum + comp.categories.spacing.score, 0) / totalComponents),
      typography: Math.round(components.reduce((sum, comp) => sum + comp.categories.typography.score, 0) / totalComponents),
      accessibility: Math.round(components.reduce((sum, comp) => sum + comp.categories.accessibility.score, 0) / totalComponents),
      responsive: Math.round(components.reduce((sum, comp) => sum + comp.categories.responsive.score, 0) / totalComponents)
    };
    
    return {
      totalComponents,
      averageScore: avgScore,
      totalIssues,
      totalWarnings,
      categories,
      status: avgScore >= 90 ? 'excellent' : avgScore >= 75 ? 'good' : avgScore >= 60 ? 'fair' : 'needs-improvement'
    };
  }

  generateRecommendations() {
    const recommendations = [];
    const summary = this.generateSummary();
    
    if (summary.categories.colors < 80) {
      recommendations.push('Improve color consistency - use CSS variables instead of hardcoded colors');
    }
    
    if (summary.categories.spacing < 80) {
      recommendations.push('Improve spacing consistency - use design system spacing tokens');
    }
    
    if (summary.categories.typography < 80) {
      recommendations.push('Improve typography consistency - use design system typography tokens');
    }
    
    if (summary.categories.accessibility < 80) {
      recommendations.push('Improve accessibility - add aria-* attributes and semantic HTML');
    }
    
    if (summary.categories.responsive < 80) {
      recommendations.push('Improve responsive design - add breakpoint-specific styles');
    }
    
    if (summary.totalIssues > 0) {
      recommendations.push(`Fix ${summary.totalIssues} consistency issues across components`);
    }
    
    return recommendations;
  }

  generateNextSteps() {
    return [
      '1. Fix critical consistency issues',
      '2. Implement missing design tokens',
      '3. Add accessibility attributes',
      '4. Improve responsive design',
      '5. Set up automated consistency checks',
      '6. Create component documentation'
    ];
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case "check":
        const report = await this.checkConsistency();
        this.printReport(report);
        break;
        
      case "analyze":
        await this.analyzeComponents();
        console.log("✅ Component analysis complete");
        break;
        
      default:
        console.log("🔍 MastroHUB v2 Design Consistency Checker");
        console.log("\nUsage:");
        console.log("  node design-consistency-checker.mjs check   - Full consistency check");
        console.log("  node design-consistency-checker.mjs analyze - Analyze components only");
        break;
    }
  }

  printReport(report) {
    console.log("\n🔍 DESIGN CONSISTENCY REPORT");
    console.log("=" .repeat(60));
    
    console.log("\n📊 SUMMARY");
    console.log(`Total Components: ${report.summary.totalComponents}`);
    console.log(`Average Score: ${report.summary.averageScore}/100`);
    console.log(`Status: ${report.summary.status.toUpperCase()}`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Total Warnings: ${report.summary.totalWarnings}`);
    
    console.log("\n🎯 CATEGORY SCORES");
    console.log(`Colors: ${report.summary.categories.colors}/100`);
    console.log(`Spacing: ${report.summary.categories.spacing}/100`);
    console.log(`Typography: ${report.summary.categories.typography}/100`);
    console.log(`Accessibility: ${report.summary.categories.accessibility}/100`);
    console.log(`Responsive: ${report.summary.categories.responsive}/100`);
    
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
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('design-consistency-checker.mjs')) {
  const checker = new DesignConsistencyChecker();
  checker.run().catch(error => {
    console.error("❌ Consistency check failed:", error.message);
    process.exit(1);
  });
}

export default DesignConsistencyChecker;
