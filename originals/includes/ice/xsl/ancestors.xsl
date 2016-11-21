<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" omit-xml-declaration="yes" indent="yes" />
  <xsl:param name="this_page"/>
  <xsl:template match="/site">
    <p class="ancestors">You are here: — 

      <xsl:for-each select="page">
        <xsl:call-template name="list"/>
        
      </xsl:for-each>
    </p>
  </xsl:template>
  <xsl:template name="list">
    <xsl:choose>
      <xsl:when test="(descendant::page[link = $this_page])">
        <xsl:element name="a">
          <xsl:attribute name="href"><xsl:value-of select="link"/></xsl:attribute>
          <xsl:value-of select="title"/>
        </xsl:element>
        <span class="seperator"> » </span>
        <xsl:for-each select="page">
          <xsl:call-template name="list"/></xsl:for-each>
      </xsl:when>
      <xsl:when test="link = $this_page">
        <strong class="current"><xsl:value-of select="title" /></strong>
      </xsl:when>
    </xsl:choose>
  </xsl:template>
</xsl:stylesheet>