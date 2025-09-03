#!/usr/bin/env node

/**
 * Frontend Automation Engine for MastroHUB v2
 * Complete design system validation and component management
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { join, dirname, basename, extname } from "path";

class FrontendAutomationEngine {
  constructor() {
    this.designSystem = {
      colors: {},
      typography: {},
      spacing: {},
      components: {},
      breakpoints: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px'
      }
    };
    
    this.validationRules = {
      colors: {
        required: ['primary', 'secondary', 'accent', 'success', 'warning', 'error'],
        contrast: 4.5, // WCAG AA minimum
        format: 'oklch'
      },
      typography: {
        required: ['font-family', 'font-size', 'line-height', 'font-weight'],
        fluid: true,
        responsive: true
      },
      spacing: {
        required: ['base', 'scale'],
        consistent: true,
        responsive: true
      },
      components: {
        required: ['Button', 'Input', 'Card', 'Badge'],
        accessibility: true,
        responsive: true
      }
    };
  }

  async analyzeDesignSystem() {
    console.log("🎨 Analyzing Design System...");
    
    // Analyze CSS tokens
    await this.analyzeCSSTokens();
    
    // Analyze Tailwind config
    await this.analyzeTailwindConfig();
    
    // Analyze components
    await this.analyzeComponents();
    
    // Generate comprehensive report
    const report = this.generateDesignSystemReport();
    
    return report;
  }

  async analyzeCSSTokens() {
    console.log("📊 Analyzing CSS Design Tokens...");
    
    const tokensFile = "app/styles/tokens.css";
    if (!existsSync(tokensFile)) {
      console.log("❌ Design tokens file not found");
      return;
    }

    const content = readFileSync(tokensFile, 'utf8');
    
    // Extract color tokens
    const colorMatches = content.match(/--color-([^:]+):\s*([^;]+);/g);
    if (colorMatches) {
      colorMatches.forEach(match => {
        const [, name, value] = match.match(/--color-([^:]+):\s*([^;]+);/);
        this.designSystem.colors[name] = value.trim();
      });
    }

    // Extract spacing tokens
    const spacingMatches = content.match(/--space-([^:]+):\s*([^;]+);/g);
    if (spacingMatches) {
      spacingMatches.forEach(match => {
        const [, name, value] = match.match(/--space-([^:]+):\s*([^;]+);/);
        this.designSystem.spacing[name] = value.trim();
      });
    }

    // Extract typography tokens
    const typographyMatches = content.match(/--(step-[^:]+|leading-[^:]+|weight-[^:]+):\s*([^;]+);/g);
    if (typographyMatches) {
      typographyMatches.forEach(match => {
        const [, name, value] = match.match(/--([^:]+):\s*([^;]+);/);
        this.designSystem.typography[name] = value.trim();
      });
    }

    console.log(`✅ Found ${Object.keys(this.designSystem.colors).length} color tokens`);
    console.log(`✅ Found ${Object.keys(this.designSystem.spacing).length} spacing tokens`);
    console.log(`✅ Found ${Object.keys(this.designSystem.typography).length} typography tokens`);
  }

  async analyzeTailwindConfig() {
    console.log("⚙️ Analyzing Tailwind Configuration...");
    
    const configFile = "tailwind.config.ts";
    if (!existsSync(configFile)) {
      console.log("❌ Tailwind config file not found");
      return;
    }

    const content = readFileSync(configFile, 'utf8');
    
    // Check for custom colors
    if (content.includes('colors:')) {
      console.log("✅ Custom colors defined in Tailwind");
    }
    
    // Check for custom spacing
    if (content.includes('spacing:')) {
      console.log("✅ Custom spacing defined in Tailwind");
    }
    
    // Check for custom typography
    if (content.includes('fontFamily:') || content.includes('fontSize:')) {
      console.log("✅ Custom typography defined in Tailwind");
    }
    
    // Check for animations
    if (content.includes('animation:') || content.includes('keyframes:')) {
      console.log("✅ Custom animations defined in Tailwind");
    }
  }

  async analyzeComponents() {
    console.log("🧩 Analyzing Component Library...");
    
    const componentsDir = "components";
    if (!existsSync(componentsDir)) {
      console.log("❌ Components directory not found");
      return;
    }

    const components = this.getComponentFiles(componentsDir);
    
    for (const component of components) {
      const analysis = await this.analyzeComponent(component);
      this.designSystem.components[basename(component, extname(component))] = analysis;
    }

    console.log(`✅ Analyzed ${components.length} components`);
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
    
    const analysis = {
      name: basename(filePath, extname(filePath)),
      path: filePath,
      hasTypeScript: content.includes('interface') || content.includes('type'),
      hasProps: content.includes('props') || content.includes('Props'),
      hasTailwind: content.includes('className'),
      hasAccessibility: content.includes('aria-') || content.includes('role='),
      hasResponsive: content.includes('sm:') || content.includes('md:') || content.includes('lg:'),
      usesDesignTokens: this.checkDesignTokenUsage(content),
      issues: []
    };

    // Check for common issues
    if (!analysis.hasTypeScript) {
      analysis.issues.push("Missing TypeScript types");
    }
    
    if (!analysis.hasProps) {
      analysis.issues.push("No props interface defined");
    }
    
    if (!analysis.hasAccessibility) {
      analysis.issues.push("Missing accessibility attributes");
    }
    
    if (!analysis.hasResponsive) {
      analysis.issues.push("Not responsive");
    }

    return analysis;
  }

  checkDesignTokenUsage(content) {
    const tokens = [
      'var(--color-',
      'var(--space-',
      'var(--step-',
      'var(--leading-',
      'var(--weight-',
      'var(--radius-',
      'var(--shadow-'
    ];
    
    return tokens.some(token => content.includes(token));
  }

  generateDesignSystemReport() {
    const report = {
      timestamp: new Date().toISOString(),
      designSystem: this.designSystem,
      validation: this.validateDesignSystem(),
      recommendations: this.generateRecommendations(),
      nextSteps: this.generateNextSteps()
    };

    // Save report
    const reportFile = `.ai/reports/design-system-analysis-${Date.now()}.json`;
    writeFileSync(reportFile, JSON.stringify(report, null, 2));

    return report;
  }

  validateDesignSystem() {
    const validation = {
      colors: this.validateColors(),
      typography: this.validateTypography(),
      spacing: this.validateSpacing(),
      components: this.validateComponents(),
      overall: 'pending'
    };

    // Calculate overall score
    const scores = Object.values(validation).filter(v => typeof v === 'object' && v.score !== undefined);
    const totalScore = scores.reduce((sum, v) => sum + v.score, 0);
    const averageScore = scores.length > 0 ? totalScore / scores.length : 0;
    
    validation.overall = {
      score: Math.round(averageScore),
      status: averageScore >= 80 ? 'excellent' : averageScore >= 60 ? 'good' : 'needs-improvement'
    };

    return validation;
  }

  validateColors() {
    const colors = this.designSystem.colors;
    const required = this.validationRules.colors.required;
    
    let score = 0;
    const issues = [];
    
    // Check required colors
    for (const color of required) {
      if (colors[color] || colors[`${color}-DEFAULT`]) {
        score += 20;
      } else {
        issues.push(`Missing required color: ${color}`);
      }
    }
    
    // Check color format
    const colorValues = Object.values(colors);
    const hasOKLCH = colorValues.some(v => v.includes('oklch'));
    if (hasOKLCH) {
      score += 20;
    } else {
      issues.push("Colors should use OKLCH format for better consistency");
    }
    
    return {
      score: Math.min(score, 100),
      issues,
      status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'
    };
  }

  validateTypography() {
    const typography = this.designSystem.typography;
    
    let score = 0;
    const issues = [];
    
    // Check for fluid typography
    const hasFluid = Object.values(typography).some(v => v.includes('clamp'));
    if (hasFluid) {
      score += 40;
    } else {
      issues.push("Typography should use fluid scaling (clamp)");
    }
    
    // Check for type scale
    const hasTypeScale = Object.keys(typography).some(k => k.startsWith('step-'));
    if (hasTypeScale) {
      score += 30;
    } else {
      issues.push("Missing type scale (step-0, step-1, etc.)");
    }
    
    // Check for line heights
    const hasLineHeights = Object.keys(typography).some(k => k.startsWith('leading-'));
    if (hasLineHeights) {
      score += 30;
    } else {
      issues.push("Missing line height tokens");
    }
    
    return {
      score: Math.min(score, 100),
      issues,
      status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'
    };
  }

  validateSpacing() {
    const spacing = this.designSystem.spacing;
    
    let score = 0;
    const issues = [];
    
    // Check for consistent spacing scale
    const spacingValues = Object.values(spacing);
    const hasConsistentScale = spacingValues.length >= 8;
    if (hasConsistentScale) {
      score += 50;
    } else {
      issues.push("Spacing scale should have at least 8 values");
    }
    
    // Check for rem units
    const hasRemUnits = spacingValues.some(v => v.includes('rem'));
    if (hasRemUnits) {
      score += 50;
    } else {
      issues.push("Spacing should use rem units for scalability");
    }
    
    return {
      score: Math.min(score, 100),
      issues,
      status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'
    };
  }

  validateComponents() {
    const components = this.designSystem.components;
    const required = this.validationRules.components.required;
    
    let score = 0;
    const issues = [];
    
    // Check required components
    for (const component of required) {
      if (components[component]) {
        score += 20;
      } else {
        issues.push(`Missing required component: ${component}`);
      }
    }
    
    // Check component quality
    const componentValues = Object.values(components);
    if (componentValues.length > 0) {
      const avgQuality = componentValues.reduce((sum, comp) => {
        let compScore = 0;
        if (comp.hasTypeScript) compScore += 25;
        if (comp.hasProps) compScore += 25;
        if (comp.hasAccessibility) compScore += 25;
        if (comp.hasResponsive) compScore += 25;
        return sum + compScore;
      }, 0) / componentValues.length;
      
      score += avgQuality * 0.5; // 50% weight for component quality
    }
    
    return {
      score: Math.min(score, 100),
      issues,
      status: score >= 80 ? 'excellent' : score >= 60 ? 'good' : 'needs-improvement'
    };
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Color recommendations
    if (Object.keys(this.designSystem.colors).length < 10) {
      recommendations.push("Expand color palette with more semantic colors");
    }
    
    // Typography recommendations
    if (!Object.keys(this.designSystem.typography).some(k => k.startsWith('step-'))) {
      recommendations.push("Implement fluid type scale for better responsive typography");
    }
    
    // Component recommendations
    const componentCount = Object.keys(this.designSystem.components).length;
    if (componentCount < 10) {
      recommendations.push("Build more reusable components for consistency");
    }
    
    // Accessibility recommendations
    const componentsWithA11y = Object.values(this.designSystem.components)
      .filter(comp => comp.hasAccessibility).length;
    if (componentsWithA11y < componentCount * 0.8) {
      recommendations.push("Improve accessibility across all components");
    }
    
    return recommendations;
  }

  generateNextSteps() {
    return [
      "1. Complete missing design tokens",
      "2. Implement required components",
      "3. Add accessibility attributes",
      "4. Test responsive design",
      "5. Create component documentation",
      "6. Set up automated testing"
    ];
  }

  async run() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
      case "analyze":
        const report = await this.analyzeDesignSystem();
        this.printReport(report);
        break;
        
      case "validate":
        await this.analyzeDesignSystem();
        console.log("✅ Design system validation complete");
        break;
        
      case "components":
        await this.analyzeComponents();
        console.log("✅ Component analysis complete");
        break;
        
      default:
        console.log("🎨 MastroHUB v2 Frontend Automation Engine");
        console.log("\nUsage:");
        console.log("  node frontend-automation-engine.mjs analyze   - Full design system analysis");
        console.log("  node frontend-automation-engine.mjs validate  - Validate design system");
        console.log("  node frontend-automation-engine.mjs components - Analyze components only");
        break;
    }
  }

  printReport(report) {
    console.log("\n🎨 DESIGN SYSTEM ANALYSIS REPORT");
    console.log("=" .repeat(60));
    
    console.log("\n📊 OVERALL STATUS");
    console.log(`Score: ${report.validation.overall.score}/100`);
    console.log(`Status: ${report.validation.overall.status.toUpperCase()}`);
    
    console.log("\n🎨 COLORS");
    console.log(`Score: ${report.validation.colors.score}/100`);
    console.log(`Status: ${report.validation.colors.status.toUpperCase()}`);
    console.log(`Tokens: ${Object.keys(report.designSystem.colors).length}`);
    if (report.validation.colors.issues.length > 0) {
      console.log("Issues:");
      report.validation.colors.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    console.log("\n📝 TYPOGRAPHY");
    console.log(`Score: ${report.validation.typography.score}/100`);
    console.log(`Status: ${report.validation.typography.status.toUpperCase()}`);
    console.log(`Tokens: ${Object.keys(report.designSystem.typography).length}`);
    if (report.validation.typography.issues.length > 0) {
      console.log("Issues:");
      report.validation.typography.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    console.log("\n📏 SPACING");
    console.log(`Score: ${report.validation.spacing.score}/100`);
    console.log(`Status: ${report.validation.spacing.status.toUpperCase()}`);
    console.log(`Tokens: ${Object.keys(report.designSystem.spacing).length}`);
    if (report.validation.spacing.issues.length > 0) {
      console.log("Issues:");
      report.validation.spacing.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    console.log("\n🧩 COMPONENTS");
    console.log(`Score: ${report.validation.components.score}/100`);
    console.log(`Status: ${report.validation.components.status.toUpperCase()}`);
    console.log(`Components: ${Object.keys(report.designSystem.components).length}`);
    if (report.validation.components.issues.length > 0) {
      console.log("Issues:");
      report.validation.components.issues.forEach(issue => console.log(`  - ${issue}`));
    }
    
    console.log("\n💡 RECOMMENDATIONS");
    report.recommendations.forEach(rec => console.log(`- ${rec}`));
    
    console.log("\n🚀 NEXT STEPS");
    report.nextSteps.forEach(step => console.log(step));
    
    console.log("\n" + "=" .repeat(60));
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('frontend-automation-engine.mjs')) {
  const engine = new FrontendAutomationEngine();
  engine.run().catch(error => {
    console.error("❌ Frontend automation failed:", error.message);
    process.exit(1);
  });
}

export default FrontendAutomationEngine;
